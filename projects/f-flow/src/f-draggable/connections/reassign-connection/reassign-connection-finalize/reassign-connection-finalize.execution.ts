import { inject, Injectable } from '@angular/core';
import { ReassignConnectionFinalizeRequest } from './reassign-connection-finalize.request';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ReassignConnectionDragHandler } from '../reassign-connection.drag-handler';
import { FDraggableBase } from '../../../f-draggable-base';
import { FReassignConnectionEvent } from '../f-reassign-connection.event';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { FConnectorBase } from '../../../../f-connectors';
import { GetInputUnderPointerRequest } from '../../get-input-under-pointer';

@Injectable()
@FExecutionRegister(ReassignConnectionFinalizeRequest)
export class ReassignConnectionFinalizeExecution implements IExecution<ReassignConnectionFinalizeRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fDraggable(): FDraggableBase {
    return this._fComponentsStore.fDraggable!;
  }

  private get _fDragHandler(): ReassignConnectionDragHandler {
    return this._fDraggableDataContext.draggableItems[ 0 ] as ReassignConnectionDragHandler;
  }

  public handle(request: ReassignConnectionFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._applyReassignEvent(request.event);
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._fDraggableDataContext.draggableItems.some(
      (x) => x instanceof ReassignConnectionDragHandler
    );
  }

  private _applyReassignEvent(event: IPointerEvent): void {
    const fInput = this._getInputUnderPointer(event);
    if (
      !!fInput && !this._isReassignToDifferentInput(fInput)
    ) {
      return;
    }
    this._emitReassignConnectionEvent(event, fInput);
  }

  private _getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this._fMediator.send<FConnectorBase | undefined>(new GetInputUnderPointerRequest(event, this._fDragHandler));
  }

  private _isReassignToDifferentInput(fInput: FConnectorBase): boolean {
    return this._fDragHandler.fConnection.fInputId !== fInput.fId;
  }

  private _emitReassignConnectionEvent(event: IPointerEvent, fInput?: FConnectorBase): void {
    this._fDraggable.fReassignConnection.emit(this._getEventData(event, fInput));
  }

  private _getEventData(event: IPointerEvent, fInput?: FConnectorBase): FReassignConnectionEvent {
    return new FReassignConnectionEvent(
      this._fDragHandler.fConnection.fId,
      this._fDragHandler.fConnection.fOutputId,
      this._fDragHandler.fConnection.fInputId,
      fInput?.fId, event.getPosition()
    );
  }
}
