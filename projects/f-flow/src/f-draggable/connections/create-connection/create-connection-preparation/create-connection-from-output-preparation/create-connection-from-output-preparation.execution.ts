import { IHandler, IPoint, IRect } from '@foblex/core';
import { Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation.request';
import { FConnectorBase } from '../../../../../f-connectors';
import { CreateConnectionDragHandlerRequest } from '../create-connection-drag-handler';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FFlowMediator } from '../../../../../infrastructure';
import { GetElementRectInFlowRequest } from '../../../../../domain';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparationExecution
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator,
  ) {
  }

  public handle(request: CreateConnectionFromOutputPreparationRequest): void {
    const { event } = request;

    const output = this.fComponentsStore.fOutputs.find((x) => {
      return x.hostElement.contains(event.targetElement);
    });
    if (!output) {
      throw new Error('Output not found');
    }
    if (output.canBeConnected) {
      this.createDragHandler(event.getPosition(), output);
    }
  }

  private createDragHandler(position: IPoint, output: FConnectorBase): void {
    this.fMediator.send(new CreateConnectionDragHandlerRequest(position, output));
  }
}
