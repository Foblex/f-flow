import { IHandler, IPointerEvent } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase, isNodeOutlet } from '../../../../f-connectors';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize.request';
import { FExecutionRegister, FFlowMediator } from '../../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { GetInputUnderPointerRequest } from '../../get-input-under-pointer';
import { OutputNotFound } from '../../../../errors';
import { GetCanBeConnectedOutputByOutletRequest } from '../get-can-be-connected-output-by-outlet';
import { FCreateConnectionEvent } from '../f-create-connection.event';
import { ReassignConnectionDragHandler } from '../../reassign-connection';

@Injectable()
@FExecutionRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalizeExecution
  implements IHandler<CreateConnectionFinalizeRequest, void> {

  private get dragHandler(): ReassignConnectionDragHandler {
    return this.fDraggableDataContext.draggableItems[ 0 ] as ReassignConnectionDragHandler;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: CreateConnectionFinalizeRequest): void {
    this.emitEvent(request.event);
    this.dragHandler.complete();
  }

  private getTargetOutput(output: FConnectorBase | undefined): FConnectorBase {
    if (!output) {
      throw OutputNotFound(this.dragHandler.connection.fOutputId);
    }
    return isNodeOutlet(output.hostElement) ? this.fMediator.send<FNodeOutputBase>(
      new GetCanBeConnectedOutputByOutletRequest(output as FNodeOutletBase)
    ) : output;
  }

  private getOutput(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.id === this.dragHandler.connection.fOutputId);
  }

  private getOutlet(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.id === this.dragHandler.connection.fOutputId);
  }

  private emitEvent(event: IPointerEvent): void {
    this.fComponentsStore.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this.getTargetOutput(this.getOutput() || this.getOutlet()).id,
        this.getInputUnderPointer(event)?.id,
        event.getPosition()
      )
    );
  }

  private getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this.fMediator.send<FConnectorBase | undefined>(new GetInputUnderPointerRequest(event, this.dragHandler));
  }
}
