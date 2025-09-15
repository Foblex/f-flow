import { inject, Injectable } from '@angular/core';
import { FReassignConnectionFinalizeRequest } from './f-reassign-connection-finalize.request';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FReassignConnectionDragHandler } from '../f-reassign-connection.drag-handler';
import { FDraggableBase } from '../../../f-draggable-base';
import { FReassignConnectionEvent } from '../f-reassign-connection.event';
import { FConnectorBase } from '../../../../f-connectors';
import { FindConnectableConnectorUsingPriorityAndPositionRequest } from '../../../../domain';
import { FDragHandlerResult } from '../../../f-drag-handler';
import { IFReassignConnectionDragResult } from '../i-f-reassign-connection-drag-result';
import { IPointerEvent } from '../../../../drag-toolkit';

@Injectable()
@FExecutionRegister(FReassignConnectionFinalizeRequest)
export class FReassignConnectionFinalizeExecution
  implements IExecution<FReassignConnectionFinalizeRequest, void>
{
  private readonly _dragResult: FDragHandlerResult<IFReassignConnectionDragResult> =
    inject(FDragHandlerResult);

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _draggableContext = inject(FDraggableDataContext);

  private get _fDraggable(): FDraggableBase {
    return this._store.fDraggable!;
  }

  private get _fDragHandler(): FReassignConnectionDragHandler {
    return this._draggableContext.draggableItems[0] as FReassignConnectionDragHandler;
  }

  public handle(request: FReassignConnectionFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._applyReassignEvent(request.event);
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._draggableContext.draggableItems.some(
      (x) => x instanceof FReassignConnectionDragHandler,
    );
  }

  private _applyReassignEvent(event: IPointerEvent): void {
    const fConnector = this._findConnectableConnectorUsingPriorityAndPosition(event);
    if (!!fConnector && !this._isReassignToDifferentConnector(fConnector)) {
      return;
    }

    this._emitReassignConnectionEvent(event, fConnector);
  }

  private _findConnectableConnectorUsingPriorityAndPosition(
    event: IPointerEvent,
  ): FConnectorBase | undefined {
    return this._mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest(
        event.getPosition(),
        this._dragResult.getData().connectableConnectors,
      ),
    );
  }

  private _isReassignToDifferentConnector(fConnector: FConnectorBase): boolean {
    if (!this._dragResult.getData().isTargetDragHandle) {
      return this._dragResult.getData().fConnection.fInputId() !== fConnector.fId();
    } else {
      return this._dragResult.getData().fConnection.fOutputId() !== fConnector.fId();
    }
  }

  private _emitReassignConnectionEvent(event: IPointerEvent, fConnector?: FConnectorBase): void {
    this._fDraggable.fReassignConnection.emit(this._getEventData(event, fConnector));
  }

  private _getEventData(
    event: IPointerEvent,
    fConnector?: FConnectorBase,
  ): FReassignConnectionEvent {
    const fConnection = this._dragResult.getData().fConnection;

    const isTargetDragHandle = this._dragResult.getData().isTargetDragHandle;

    return new FReassignConnectionEvent(
      fConnection.fId(),
      !isTargetDragHandle,
      isTargetDragHandle,
      fConnection.fOutputId(),
      !isTargetDragHandle ? fConnector?.fId() : undefined,
      fConnection.fInputId(),
      isTargetDragHandle ? fConnector?.fId() : undefined,
      event.getPosition(),
    );
  }
}
