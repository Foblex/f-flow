import { IHandler } from '@foblex/mediator';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase, isNodeOutlet } from '../../../../f-connectors';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { OutputNotFound } from '../../../../errors';
import { GetCanBeConnectedOutputByOutletRequest } from '../get-can-be-connected-output-by-outlet';
import { FCreateConnectionEvent } from '../f-create-connection.event';
import { CreateConnectionDragHandler } from '../create-connection.drag-handler';
import { GetInputUnderPointerRequest } from '../../get-input-under-pointer';

@Injectable()
@FExecutionRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalizeExecution
  implements IHandler<CreateConnectionFinalizeRequest, void> {

  private get dragHandler(): CreateConnectionDragHandler {
    return this.fDraggableDataContext.draggableItems[ 0 ] as CreateConnectionDragHandler;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: CreateConnectionFinalizeRequest): void {
    this.emitEvent(request.event);
    this.dragHandler.complete();
  }

  private getTargetOutput(output: FConnectorBase | undefined): FConnectorBase {
    if (!output) {
      throw OutputNotFound(this.dragHandler.fConnection.fOutputId);
    }
    return isNodeOutlet(output.hostElement) ? this.fMediator.send<FNodeOutputBase>(
      new GetCanBeConnectedOutputByOutletRequest(output as FNodeOutletBase)
    ) : output;
  }

  private getOutput(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.fId === this.dragHandler.fConnection.fOutputId);
  }

  private getOutlet(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.fId === this.dragHandler.fConnection.fOutputId);
  }

  private emitEvent(event: IPointerEvent): void {
    this.fComponentsStore.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this.getTargetOutput(this.getOutput() || this.getOutlet()).fId,
        this.getInputUnderPointer(event)?.fId,
        event.getPosition()
      )
    );
  }

  private getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this.fMediator.send<FConnectorBase | undefined>(new GetInputUnderPointerRequest(event, this.dragHandler));
  }
}
