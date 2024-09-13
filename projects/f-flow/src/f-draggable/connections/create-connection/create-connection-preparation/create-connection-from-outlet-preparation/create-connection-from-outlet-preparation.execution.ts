import { IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';
import { GetCanBeConnectedOutputByOutletRequest } from '../../get-can-be-connected-output-by-outlet';
import { RequiredOutput } from '../../../../../errors';
import { CreateConnectionDragHandlerRequest } from '../create-connection-drag-handler';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutletPreparationRequest)
export class CreateConnectionFromOutletPreparationExecution
  implements IHandler<CreateConnectionFromOutletPreparationRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: CreateConnectionFromOutletPreparationRequest): void {
    const { event } = request;
    const node = this.fComponentsStore.findNode(event.targetElement)!;

    const outlet = this.fComponentsStore.fOutlets.find((x) => {
      return x.hostElement.contains(event.targetElement);
    });
    if (!outlet) {
      throw new Error('Outlet not found');
    }
    const nodeOutputs = this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
    (outlet as FNodeOutletBase).setOutputs(nodeOutputs);

    if (outlet.canBeConnected) {

      if ((outlet as FNodeOutletBase).isConnectionFromOutlet) {

        this.createDragHandler(event.getPosition(), outlet);
      } else {
        const output = this.fMediator.send<FNodeOutputBase>(
          new GetCanBeConnectedOutputByOutletRequest(outlet as FNodeOutletBase)
        );
        if (!output) {
          throw RequiredOutput();
        }
        this.createDragHandler(event.getPosition(), output);
      }
    }
  }

  private createDragHandler(position: IPoint, output: FConnectorBase): void {
    this.fMediator.send(new CreateConnectionDragHandlerRequest(position, output));
  }
}
