import { inject, Injectable } from '@angular/core';
import { FMediator } from '@foblex/mediator';
import { IPoint, IRoundedRect, RectExtensions, RoundedRect } from '@foblex/2d';
import { FConnectorBase, FSourceConnectorBase, isOutletConnector } from '../../../../f-connectors';
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
  FindConnectableConnectorUsingPriorityAndPositionRequest,
  GetConnectorRectReferenceRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  ResolveConnectionEndpointRotationContextRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../../domain';
import { ResolveConnectableOutputForOutletRequest } from '../resolve-connectable-output-for-outlet';
import { FCreateConnectionEvent } from '../f-create-connection-event';

/**
 * One in-progress connection creation, independent of the gesture that drives it.
 *
 * The drag-to-connect handler and the click-to-connect flow both delegate here, so the
 * preview line, snap highlighting, connectable marking, target resolution, and the
 * `fCreateConnection` emission behave identically in every mode. The session owns its
 * state (it survives the per-pointerdown drag-context reset), and `begin()` refuses to
 * start when no `<f-connection-for-create>` is present — the same opt-in gate the drag
 * path uses.
 */
@Injectable()
export class FCreateConnectionSession {
  private readonly _mediator = inject(FMediator);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  private readonly _store = inject(FComponentsStore);

  private _targets: IConnectorRectRef[] = [];
  private _sourceRef: IConnectorRectRef<FSourceConnectorBase> | undefined;

  private get _connection(): FConnectionForCreateComponent | undefined {
    return this._store.connections.getForCreate() as FConnectionForCreateComponent | undefined;
  }

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.connections.getForSnap();
  }

  public get isActive(): boolean {
    return !!this._sourceRef;
  }

  /** Id of the connector the session started from (outlet id when started from an outlet). */
  public get sourceId(): string | undefined {
    return this._sourceRef?.connector.fId();
  }

  /** Connectors the in-progress connection may attach to, with their rects. */
  public get connectableTargets(): IConnectorRectRef[] {
    return this._targets;
  }

  /**
   * Starts a session from a source connector. `canvasPoint` is the pointer position in
   * canvas-local space (see `CreateConnectionCreateDragHandler` for the conversion).
   * Returns `false` when no `<f-connection-for-create>` is rendered.
   */
  public begin(source: FSourceConnectorBase, canvasPoint: IPoint): boolean {
    if (!this._connection) {
      return false;
    }
    if (this.isActive) {
      this.cancel();
    }

    this._sourceRef = this._mediator.execute<IConnectorRectRef<FSourceConnectorBase>>(
      new GetConnectorRectReferenceRequest(source),
    );

    this._collectAndMarkTargets();
    this._initSnapConnection();
    this._initCreateConnection();

    this._connection.show();
    this.update(canvasPoint);

    return true;
  }

  /** Redraws the preview and snap lines toward the given canvas-local point. */
  public update(canvasPoint: IPoint): void {
    const sourceRef = this._sourceRef;
    if (!sourceRef) {
      return;
    }

    const pointer = RoundedRect.fromRect(RectExtensions.initialize(canvasPoint.x, canvasPoint.y));

    const closest = this._findClosestTarget(pointer);
    const targetSide = closest?.connector.fConnectableSide || EFConnectableSide.TOP;

    this._drawCreateConnection(sourceRef, pointer, targetSide);

    const snap = this._snapConnection;
    if (!snap) {
      return;
    }

    const snapTarget = closest && closest.distance < snap.fSnapThreshold ? closest : undefined;
    this._drawSnapConnection(sourceRef, snapTarget);
  }

  /**
   * Resolves the connectable target at a client-space point using the same priority as
   * the drag drop: rect hit, then snap-threshold closest, then `fConnectOnNode` node.
   */
  public resolveTarget(clientPoint: IPoint): FConnectorBase | undefined {
    return this._mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest(clientPoint, this._targets),
    );
  }

  /**
   * Emits `fCreateConnection` for the target at the given client-space point (target is
   * `undefined` when nothing connectable is there — same contract as a drag drop) and
   * ends the session.
   */
  public complete(clientPoint: IPoint): void {
    const sourceRef = this._sourceRef;
    if (!sourceRef) {
      return;
    }

    this._store.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this._resolveEventSource(sourceRef.connector).fId(),
        this.resolveTarget(clientPoint)?.fId(),
        clientPoint,
      ),
    );

    this._end();
  }

  /** Ends the session without emitting. */
  public cancel(): void {
    if (this.isActive) {
      this._end();
    }
  }

  private _resolveEventSource(source: FSourceConnectorBase): FConnectorBase {
    return isOutletConnector(source)
      ? this._mediator.execute<FSourceConnectorBase>(
          new ResolveConnectableOutputForOutletRequest(source),
        )
      : source;
  }

  private _collectAndMarkTargets(): void {
    const sourceRef = this._sourceRef as IConnectorRectRef<FSourceConnectorBase>;

    this._targets = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateTargetConnectorsToConnectRequest(
        sourceRef.connector,
        sourceRef.rect.gravityCenter,
      ),
    );

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)),
    );
  }

  private _initSnapConnection(): void {
    const sourceRef = this._sourceRef;
    if (!this._snapConnection || !sourceRef) {
      return;
    }
    this._snapConnection.fOutputId.set(sourceRef.connector.fId());
    this._snapConnection.initialize();
  }

  private _initCreateConnection(): void {
    const sourceRef = this._sourceRef;
    const connection = this._connection;
    if (!connection || !sourceRef) {
      return;
    }
    connection.fOutputId.set(sourceRef.connector.fId());
    connection.initialize();
  }

  private _findClosestTarget(pointer: IPoint): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(pointer, this._targets),
    );
  }

  private _drawCreateConnection(
    sourceRef: IConnectorRectRef<FSourceConnectorBase>,
    pointer: IRoundedRect,
    targetSide: EFConnectableSide,
  ): void {
    const connection = this._connection;
    if (!connection) {
      return;
    }

    const line = this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        sourceRef.rect,
        pointer,
        connection,
        sourceRef.connector.fConnectableSide,
        targetSide,
        this._resolveRotationContext(sourceRef.connector),
      ),
    );

    connection.setLine(line);
    connection.redraw();
  }

  private _drawSnapConnection(
    sourceRef: IConnectorRectRef<FSourceConnectorBase>,
    target: IClosestConnectorRef | undefined,
  ): void {
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
        sourceRef.rect,
        target.rect,
        snap,
        sourceRef.connector.fConnectableSide,
        target.connector.fConnectableSide,
        this._resolveRotationContext(sourceRef.connector),
        this._resolveRotationContext(target.connector),
      ),
    );
    snap.show();
    snap.setLine(line);
    snap.redraw();
  }

  private _end(): void {
    const connection = this._connection;
    if (connection) {
      connection.redraw();
      connection.hide();
    }
    this._snapConnection?.hide();
    this._forceCanvasLayerRepaint();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)),
    );

    this._targets = [];
    this._sourceRef = undefined;
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
    const layer = this._connection?.hostElement.closest('f-canvas') as HTMLElement | null;
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
