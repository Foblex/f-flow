import { inject, Injectable } from '@angular/core';
import { FReassignConnectionFinalizeRequest } from './f-reassign-connection-finalize.request';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FReassignConnectionDragHandler } from '../f-reassign-connection.drag-handler';
import { FDraggableBase } from '../../../f-draggable-base';
import { FReassignConnectionEvent } from '../f-reassign-connection.event';
import { FConnectorBase } from '../../../../f-connectors';
import { FindInputAtPositionRequest } from '../../../../domain';
import { FDragHandlerResult } from '../../../f-drag-handler';
import { IFReassignConnectionDragResult } from '../i-f-reassign-connection-drag-result';
import {IPointerEvent} from "../../../../drag-toolkit";

@Injectable()
@FExecutionRegister(FReassignConnectionFinalizeRequest)
export class FReassignConnectionFinalizeExecution implements IExecution<FReassignConnectionFinalizeRequest, void> {

  private _fResult: FDragHandlerResult<IFReassignConnectionDragResult> = inject(FDragHandlerResult);

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fDraggable(): FDraggableBase {
    return this._fComponentsStore.fDraggable!;
  }

  private get _fDragHandler(): FReassignConnectionDragHandler {
    return this._fDraggableDataContext.draggableItems[ 0 ] as FReassignConnectionDragHandler;
  }

  public handle(request: FReassignConnectionFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._applyReassignEvent(request.event);
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._fDraggableDataContext.draggableItems.some(
      (x) => x instanceof FReassignConnectionDragHandler
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
    return this._fMediator.execute<FConnectorBase | undefined>(
      new FindInputAtPositionRequest(
        event.getPosition(),
        this._fResult.getData().toConnectorRect,
        this._fResult.getData().canBeConnectedInputs
      )
    );
  }

  private _isReassignToDifferentInput(fInput: FConnectorBase): boolean {
    return this._fResult.getData().fConnection.fInputId !== fInput.fId;
  }

  private _emitReassignConnectionEvent(event: IPointerEvent, fInput?: FConnectorBase): void {
    this._fDraggable.fReassignConnection.emit(this._getEventData(event, fInput));
  }

  private _getEventData(event: IPointerEvent, fInput?: FConnectorBase): FReassignConnectionEvent {
    const fConnection = this._fResult.getData().fConnection;

    return new FReassignConnectionEvent(
      fConnection.fId,
      fConnection.fOutputId,
      fConnection.fInputId,
      fInput?.fId, event.getPosition()
    );
  }
}
