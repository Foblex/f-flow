import { FMediator } from '@foblex/mediator';
import { IPoint, IRoundedRect, PointExtensions, RectExtensions, RoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase } from '../../../../f-connectors';
import { DragHandlerBase, FDragHandlerResult } from '../../../infrastructure';
import { ICreateConnectionEventData } from '../i-create-connection-event-data';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  EFConnectableSide,
  IConnectionEndpointRotationContext,
} from '../../../../f-connection-v2';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectionForCreateComponent, FSnapConnectionComponent } from '../../../../f-connection';
import {
  CalculateClosestConnectorRequest,
  CalculateTargetConnectorsToConnectRequest,
  GetConnectorRectReferenceRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  ResolveConnectionEndpointRotationContextRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../../domain';

type FSourceConnector = FNodeOutputBase | FNodeOutletBase;

@Injectable()
export class CreateConnectionHandler extends DragHandlerBase<ICreateConnectionEventData> {
  protected readonly type = 'create-connection';
  protected readonly kind = 'create-connection';

  protected override data() {
    return { fOutputOrOutletId: this._sourceRef.connector.fId() };
  }

  private readonly _result = inject(FDragHandlerResult);
  private readonly _mediator = inject(FMediator);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  private readonly _store = inject(FComponentsStore);

  private get _connection(): FConnectionForCreateComponent {
    return this._store.connections.getForCreate() as FConnectionForCreateComponent;
  }

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.connections.getForSnap();
  }

  private _targets: IConnectorRectRef[] = [];
  private _sourceRef!: IConnectorRectRef<FSourceConnector>;
  private _pointerDown = new RoundedRect();

  public initialize(source: FSourceConnector, pointer: IPoint): void {
    this._sourceRef = this._mediator.execute<IConnectorRectRef<FSourceConnector>>(
      new GetConnectorRectReferenceRequest(source),
    );
    this._pointerDown = RoundedRect.fromRect(RectExtensions.initialize(pointer.x, pointer.y));
  }

  public override prepareDragSequence(): void {
    this._collectAndMarkTargets();
    this._initSnapConnection();
    this._initCreateConnection();

    this._connection.show();
    this.onPointerMove(PointExtensions.initialize());

    this._result.setData({
      toConnectorRect: this._pointerDown,
      canBeConnectedInputs: this._targets,
      fOutputId: this._sourceRef.connector.fId(),
    });
  }

  private _collectAndMarkTargets(): void {
    this._targets = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateTargetConnectorsToConnectRequest(
        this._sourceRef.connector,
        this._sourceRef.rect.gravityCenter,
      ),
    );

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)),
    );
  }

  private _initSnapConnection(): void {
    if (!this._snapConnection) {
      return;
    }
    this._snapConnection.fOutputId.set(this._sourceRef.connector.fId());
    this._snapConnection.initialize();
  }

  private _initCreateConnection(): void {
    this._connection.fOutputId.set(this._sourceRef.connector.fId());
    this._connection.initialize();
  }

  public override onPointerMove(difference: IPoint): void {
    const pointer = this._pointerDown.addPoint(difference);

    const closest = this._findClosestTarget(pointer);
    const targetSide = closest?.connector.fConnectableSide || EFConnectableSide.TOP;

    this._drawCreateConnection(pointer, targetSide);

    const snap = this._snapConnection;
    if (!snap) {
      return;
    }

    const snapTarget = closest && closest.distance < snap.fSnapThreshold ? closest : undefined;
    this._drawSnapConnection(snapTarget);
  }

  private _findClosestTarget(pointer: IPoint): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(pointer, this._targets),
    );
  }

  private _drawCreateConnection(pointer: IRoundedRect, targetSide: EFConnectableSide): void {
    const line = this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceRef.rect,
        pointer,
        this._connection,
        this._sourceRef.connector.fConnectableSide,
        targetSide,
        this._resolveRotationContext(this._sourceRef.connector),
      ),
    );

    this._connection.setLine(line);
    this._connection.redraw();
  }

  private _drawSnapConnection(target: IClosestConnectorRef | undefined): void {
    const snap = this._snapConnection;
    if (!snap) {
      return;
    }

    if (!target) {
      snap.hide();

      return;
    }

    const line = this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceRef.rect,
        target.rect,
        snap,
        this._sourceRef.connector.fConnectableSide,
        target.connector.fConnectableSide,
        this._resolveRotationContext(this._sourceRef.connector),
        this._resolveRotationContext(target.connector),
      ),
    );
    snap.show();
    snap.setLine(line);
    snap.redraw();
  }

  public override onPointerUp(): void {
    this._connection.redraw();
    this._connection.hide();
    this._snapConnection?.hide();
    this._forceCanvasLayerRepaint();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)),
    );
  }

  /**
   * Force the canvas compositing layer to repaint once after the preview is hidden.
   *
   * The preview line is painted by an `<svg overflow: visible>` inside a zero-size host
   * (`.f-connections-container` is 0×0). Safari/WebKit does not invalidate the ink
   * painted outside that box, so on `display: none` the preview line — often several
   * accumulated frames of it — stays painted until an unrelated repaint happens (e.g.
   * moving the pointer off the flow). `f-canvas` owns the compositing layer the ink is
   * rasterized into, so toggling it out of and back into the render tree re-rasters the
   * whole layer and clears the remnant. The toggle is synchronous, so the element's size
   * is unchanged by the end of the frame and no `ResizeObserver` fires. Chrome
   * invalidates the full region on hide and is unaffected. See issue #311.
   */
  private _forceCanvasLayerRepaint(): void {
    const layer = this._connection.hostElement.closest('f-canvas') as HTMLElement | null;
    if (!layer) {
      return;
    }
    const previousDisplay = layer.style.display;
    layer.style.display = 'none';
    void layer.offsetHeight; // force a synchronous reflow so the hidden state is committed
    layer.style.display = previousDisplay;
  }

  private _resolveRotationContext(
    connector?: FConnectorBase,
  ): IConnectionEndpointRotationContext | undefined {
    return this._mediator.execute<IConnectionEndpointRotationContext | undefined>(
      new ResolveConnectionEndpointRotationContextRequest(connector),
    );
  }
}
