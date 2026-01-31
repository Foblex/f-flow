import { ILine, IPoint, PointExtensions, RoundedRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { GetConnectorRectReferenceRequest, IConnectorRectRef } from '../../../domain';
import { FConnectorBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { Injector } from '@angular/core';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  FConnectionBase,
} from '../../../f-connection-v2';

export class BaseConnectionDragHandler {
  private readonly _mediator: FMediator;
  private readonly _store: FComponentsStore;
  private readonly _connectionBehaviour: ConnectionBehaviourBuilder;

  private _fOutputWithRect!: IConnectorRectRef;
  private _fInputWithRect!: IConnectorRectRef;

  private get _fOutput(): FConnectorBase {
    return this._store.outputs.require(this.fConnection.fOutputId());
  }

  private get _fInput(): FConnectorBase {
    return this._store.inputs.require(this.fConnection.fInputId());
  }

  private _sourceDifference = PointExtensions.initialize();
  private _targetDifference = PointExtensions.initialize();

  constructor(
    _injector: Injector,
    public fConnection: FConnectionBase,
  ) {
    this._mediator = _injector.get(FMediator);
    this._connectionBehaviour = _injector.get(ConnectionBehaviourBuilder);
    this._store = _injector.get(FComponentsStore);
    this._initialize();
  }

  private _initialize(): void {
    this._fOutputWithRect = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(this._fOutput),
    );
    this._fInputWithRect = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(this._fInput),
    );
  }

  public setSourceDifference(difference: IPoint): void {
    this._sourceDifference = difference;
  }

  public setTargetDifference(difference: IPoint): void {
    this._targetDifference = difference;
  }

  protected redraw(): void {
    this._redrawConnection(this._recalculateConnection());
  }

  private _recalculateConnection(): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        RoundedRect.fromRoundedRect(this._fOutputWithRect.rect).addPoint(this._sourceDifference),
        RoundedRect.fromRoundedRect(this._fInputWithRect.rect).addPoint(this._targetDifference),
        this.fConnection,
        this._fOutputWithRect.connector.fConnectableSide,
        this._fInputWithRect.connector.fConnectableSide,
      ),
    );
  }

  private _redrawConnection(line: ILine): void {
    this.fConnection.setLine(line);
    this.fConnection.redraw();
  }

  private _connectorNotFoundPrefix(message: string): string {
    return `ConnectionDragHandler Error: Connection From (fOutput)${this.fConnection.fOutputId} To (fInput)${this.fConnection.fInputId}. ${message}. Please ensure that all f-connections are associated with existing connectors`;
  }
}
