import { IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation.request';
import { FConnectorBase, FNodeOutputDirective } from '../../../../../f-connectors';
import { CreateConnectionDragHandlerRequest } from '../create-connection-drag-handler';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparationExecution
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: CreateConnectionFromOutputPreparationRequest): void {
    const { event } = request;

    const fOutput = this.fComponentsStore.fOutputs.find((x) => {
      return x.hostElement.contains(event.targetElement);
    });
    if (!fOutput) {
      throw new Error('Output not found');
    }
    if (fOutput.canBeConnected) {
      this.createDragHandler(event.getPosition(), fOutput as FNodeOutputDirective);
    }
  }

  private createDragHandler(position: IPoint, fOutput: FNodeOutputDirective): void {
    this.fMediator.send(new CreateConnectionDragHandlerRequest(position, fOutput));
  }
}
