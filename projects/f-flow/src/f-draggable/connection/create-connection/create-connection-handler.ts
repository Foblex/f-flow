import { DragHandlerBase, FDragHandlerResult } from '../../f-drag-handler';
import {
  CalculateClosestConnectorRequest,
  CalculateTargetConnectorsToConnectRequest,
  GetConnectorRectReferenceRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import { FConnectionForCreateComponent, FSnapConnectionComponent } from '../../../f-connection';
import { FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { IPoint, IRoundedRect, PointExtensions, RectExtensions, RoundedRect } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { ICreateConnectionDragResult } from './i-create-connection-drag-result';
import { Injector } from '@angular/core';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  EFConnectableSide,
} from '../../../f-connection-v2';
import { ICreateConnectionEventData } from './i-create-connection-event-data';

export class CreateConnectionHandler extends DragHandlerBase<ICreateConnectionEventData> {
  protected readonly type = 'create-connection';
  protected override data() {
    return { fOutputOrOutletId: this._fOutputOrOutlet.fId() };
  }

  private readonly _result: FDragHandlerResult<ICreateConnectionDragResult>;
  private readonly _mediator: FMediator;
  private readonly _connectionBehaviour: ConnectionBehaviourBuilder;
  private readonly _store: FComponentsStore;

  private readonly _toConnectorRect = new RoundedRect();

  private get _connection(): FConnectionForCreateComponent {
    return this._store.connections.getForCreate<FConnectionForCreateComponent>() as FConnectionForCreateComponent;
  }

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.connections.getForSnap<FSnapConnectionComponent>();
  }

  private _fOutputWithRect!: IConnectorRectRef;

  private _canBeConnectedInputs: IConnectorRectRef[] = [];

  constructor(
    _injector: Injector,
    private _fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
    _onPointerDownPosition: IPoint,
  ) {
    super();
    this._result = _injector.get(FDragHandlerResult);
    this._mediator = _injector.get(FMediator);
    this._connectionBehaviour = _injector.get(ConnectionBehaviourBuilder);
    this._store = _injector.get(FComponentsStore);

    this._toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(_onPointerDownPosition.x, _onPointerDownPosition.y),
    );
  }

  public override prepareDragSequence(): void {
    this._fOutputWithRect = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(this._fOutputOrOutlet),
    );
    this._getAndMarkCanBeConnectedInputs();
    this._initializeSnapConnection();
    this._initializeConnectionForCreate();

    this._connection.show();
    this.onPointerMove(PointExtensions.initialize());

    this._result.setData({
      toConnectorRect: this._toConnectorRect,
      canBeConnectedInputs: this._canBeConnectedInputs,
      fOutputId: this._fOutputOrOutlet.fId(),
    });
  }

  private _getAndMarkCanBeConnectedInputs(): void {
    this._canBeConnectedInputs = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateTargetConnectorsToConnectRequest(
        this._fOutputOrOutlet,
        this._fOutputWithRect.rect.gravityCenter,
      ),
    );

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.connector)),
    );
  }

  private _initializeSnapConnection(): void {
    if (!this._snapConnection) {
      return;
    }
    this._snapConnection.fOutputId.set(this._fOutputOrOutlet.fId());
    this._snapConnection.initialize();
  }

  private _initializeConnectionForCreate(): void {
    this._connection.fOutputId.set(this._fOutputOrOutlet.fId());
    this._connection.initialize();
  }

  public override onPointerMove(difference: IPoint): void {
    const closestInput = this._findClosestInput(difference);

    this._drawConnectionForCreate(
      this._toConnectorRect.addPoint(difference),
      closestInput?.connector.fConnectableSide || EFConnectableSide.TOP,
    );

    if (this._snapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(closestInput));
    }
  }

  private _drawConnectionForCreate(toConnectorRect: IRoundedRect, fSide: EFConnectableSide): void {
    const line = this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._fOutputWithRect.rect,
        toConnectorRect,
        this._connection,
        this._fOutputWithRect.connector.fConnectableSide,
        fSide,
      ),
    );

    this._connection.setLine(line);
    this._connection.redraw();
  }

  private _drawSnapConnection(fClosestInput: IClosestConnectorRef | undefined): void {
    if (fClosestInput) {
      const line = this._connectionBehaviour.handle(
        new ConnectionBehaviourBuilderRequest(
          this._fOutputWithRect.rect,
          fClosestInput.rect,
          this._snapConnection!,
          this._fOutputWithRect.connector.fConnectableSide,
          fClosestInput.connector.fConnectableSide,
        ),
      );
      this._snapConnection?.show();
      this._snapConnection?.setLine(line);
      this._snapConnection?.redraw();
    } else {
      this._snapConnection?.hide();
    }
  }

  private _findClosestInput(difference: IPoint): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(
        this._toConnectorRect.addPoint(difference),
        this._canBeConnectedInputs,
      ),
    );
  }

  private _getClosestInputForSnapConnection(
    fClosestInput: IClosestConnectorRef | undefined,
  ): IClosestConnectorRef | undefined {
    return fClosestInput && fClosestInput.distance < this._snapConnection!.fSnapThreshold
      ? fClosestInput
      : undefined;
  }

  public override onPointerUp(): void {
    this._connection.redraw();
    this._connection.hide();
    this._snapConnection?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.connector)),
    );
  }
}
