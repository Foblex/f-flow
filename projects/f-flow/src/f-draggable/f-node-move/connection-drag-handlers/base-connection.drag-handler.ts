import { ILine, IPoint, PointExtensions, RoundedRect } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import {
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorAndRectRequest,
  IConnectorAndRect,
} from '../../../domain';
import { FConnectorBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase } from '../../../f-connection';
import { Injector } from '@angular/core';

export class BaseConnectionDragHandler {
  private readonly _mediator: FMediator;
  private readonly _store: FComponentsStore;

  private _fOutputWithRect!: IConnectorAndRect;
  private _fInputWithRect!: IConnectorAndRect;

  private get _fOutput(): FConnectorBase {
    const result = this._store.fOutputs.find((x) => x.fId() === this.fConnection.fOutputId());
    if (!result) {
      throw new Error(
        this._connectorNotFoundPrefix(`fOutput with id ${this.fConnection.fOutputId} not found`),
      );
    }

    return result;
  }

  private get _fInput(): FConnectorBase {
    const result = this._store.fInputs.find((x) => x.fId() === this.fConnection.fInputId());
    if (!result) {
      throw new Error(
        this._connectorNotFoundPrefix(`fInput with id ${this.fConnection.fInputId} not found`),
      );
    }

    return result;
  }

  private _sourceDifference = PointExtensions.initialize();
  private _targetDifference = PointExtensions.initialize();

  constructor(
    _injector: Injector,
    public fConnection: FConnectionBase,
  ) {
    this._mediator = _injector.get(FMediator);
    this._store = _injector.get(FComponentsStore);
    this._initialize();
  }

  private _initialize(): void {
    this._fOutputWithRect = this._mediator.execute<IConnectorAndRect>(
      new GetConnectorAndRectRequest(this._fOutput),
    );
    this._fInputWithRect = this._mediator.execute<IConnectorAndRect>(
      new GetConnectorAndRectRequest(this._fInput),
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
    return this._mediator.execute<ILine>(
      new CalculateConnectionLineByBehaviorRequest(
        RoundedRect.fromRoundedRect(this._fOutputWithRect.fRect).addPoint(this._sourceDifference),
        RoundedRect.fromRoundedRect(this._fInputWithRect.fRect).addPoint(this._targetDifference),
        this.fConnection.fBehavior,
        this._fOutputWithRect.fConnector.fConnectableSide,
        this._fInputWithRect.fConnector.fConnectableSide,
      ),
    );
  }

  private _redrawConnection(line: ILine): void {
    this.fConnection.setLine(
      line,
      this._fOutputWithRect.fConnector.fConnectableSide,
      this._fInputWithRect.fConnector.fConnectableSide,
    );
    this.fConnection.redraw();
  }

  private _connectorNotFoundPrefix(message: string): string {
    return `ConnectionDragHandler Error: Connection From (fOutput)${this.fConnection.fOutputId} To (fInput)${this.fConnection.fInputId}. ${message}. Please ensure that all f-connections are associated with existing connectors`;
  }
}
