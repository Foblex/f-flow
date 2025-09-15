import { FDragHandlerResult, IFDragHandler } from '../../f-drag-handler';
import { GetConnectorAndRectRequest, IConnectorAndRect } from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { FNodeInputDirective, FNodeOutputDirective } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { IFReassignConnectionDragResult } from './i-f-reassign-connection-drag-result';
import { Injector } from '@angular/core';
import { IFReassignHandler, roundedRectFromPoint } from './i-f-reassign-handler';
import { FReassignTargetDragHandler } from './f-reassign-target.drag-handler';
import { FReassignSourceDragHandler } from './f-reassign-source.drag-handler';

export class FReassignConnectionDragHandler implements IFDragHandler {
  public fEventType = 'reassign-connection';
  public fData: unknown;

  private readonly _result: FDragHandlerResult<IFReassignConnectionDragResult>;
  private readonly _mediator: FMediator;
  private readonly _store: FComponentsStore;

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.fSnapConnection as FSnapConnectionComponent;
  }

  private get _sourceConnector(): FNodeOutputDirective {
    const result = this._store.fOutputs.find((x) => x.fId() === this._connection.fOutputId());
    if (!result) {
      throw new Error('Connection output not found');
    }

    return result as FNodeOutputDirective;
  }

  private get _targetConnector(): FNodeInputDirective {
    const result = this._store.fInputs.find((x) => x.fId() === this._connection.fInputId());
    if (!result) {
      throw new Error('Connection input not found');
    }

    return result as FNodeInputDirective;
  }

  private get _sourceConnectorAndRect(): IConnectorAndRect {
    return this._mediator.execute<IConnectorAndRect>(
      new GetConnectorAndRectRequest(this._sourceConnector),
    );
  }

  private get _targetConnectorAndRect(): IConnectorAndRect {
    return this._mediator.execute<IConnectorAndRect>(
      new GetConnectorAndRectRequest(this._targetConnector),
    );
  }

  private _reassignHandler!: IFReassignHandler;

  constructor(
    _injector: Injector,
    private _connection: FConnectionBase,
    private _isTargetDragHandle: boolean,
  ) {
    this._result = _injector.get(FDragHandlerResult);
    this._mediator = _injector.get(FMediator);
    this._store = _injector.get(FComponentsStore);

    this.fData = {
      fConnectionId: this._connection.fId(),
    };

    this._reassignHandler = this._isTargetDragHandle
      ? this._targetDragHandler()
      : this._sourceDragHandler();
  }

  private _sourceDragHandler(): FReassignSourceDragHandler {
    return new FReassignSourceDragHandler(
      this._mediator,
      this._connection,
      this._sourceConnectorAndRect,
      this._targetConnectorAndRect,
    );
  }

  private _targetDragHandler(): FReassignTargetDragHandler {
    return new FReassignTargetDragHandler(
      this._mediator,
      this._connection,
      this._sourceConnectorAndRect,
      this._targetConnectorAndRect,
    );
  }

  public prepareDragSequence(): void {
    this._reassignHandler.markConnectableConnector();
    this._reassignHandler.initializeSnapConnection(this._snapConnection);

    this._result.setData({
      isTargetDragHandle: this._isTargetDragHandle,
      sourceConnectorRect: roundedRectFromPoint(this._connection.line.point1),
      targetConnectorRect: roundedRectFromPoint(this._connection.line.point2),
      connectableConnectors: this._reassignHandler.getConnectableConnectors(),
      fConnection: this._connection,
    });
  }

  public onPointerMove(difference: IPoint): void {
    this._reassignHandler.onPointerMove(difference);
  }

  public onPointerUp(): void {
    this._reassignHandler.onPointerUp();
  }
}
