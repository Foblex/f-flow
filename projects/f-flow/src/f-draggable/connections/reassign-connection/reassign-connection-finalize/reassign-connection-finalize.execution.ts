import { Injectable } from '@angular/core';
import { ReassignConnectionFinalizeRequest } from './reassign-connection-finalize.request';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../../infrastructure';
import { ReassignConnectionDragHandler } from '../reassign-connection.drag-handler';
import { FDraggableBase } from '../../../f-draggable-base';
import { GetInputUnderPointerRequest } from '../../get-input-under-pointer';
import { FReassignConnectionEvent } from '../f-reassign-connection.event';
import { IPointerEvent } from '@foblex/core';
import { FConnectorBase } from '../../../../f-connectors';

@Injectable()
@FExecutionRegister(ReassignConnectionFinalizeRequest)
export class ReassignConnectionFinalizeExecution implements IExecution<ReassignConnectionFinalizeRequest, void> {

  private get fDraggable(): FDraggableBase {
    return this.fComponentsStore.fDraggable!;
  }

  private get dragHandler(): ReassignConnectionDragHandler {
    return this.fDraggableDataContext.draggableItems[ 0 ] as ReassignConnectionDragHandler;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: ReassignConnectionFinalizeRequest): void {
    this.emitEvent(request.event);
    this.dragHandler.complete();
  }

  private emitEvent(event: IPointerEvent): void {
    const input = this.getInputUnderPointer(event);
    if (
      !input || !this.isReassignToDifferentInput(input)
    ) {
      return;
    }
    this.fDraggable.fReassignConnection.emit(
      new FReassignConnectionEvent(
        this.dragHandler.connection.fConnectionId,
        this.dragHandler.connection.fOutputId,
        this.dragHandler.connection.fInputId,
        input.id
      )
    );
  }

  private getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this.fMediator.send<FConnectorBase | undefined>(new GetInputUnderPointerRequest(event, this.dragHandler));
  }

  private isReassignToDifferentInput(inputsUnderPointer: FConnectorBase): boolean {
    return this.dragHandler.connection.fInputId !== inputsUnderPointer.id;
  }
}
