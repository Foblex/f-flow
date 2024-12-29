import { IHandler } from '@foblex/mediator';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, isNodeOutlet, isNodeOutput } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { CreateConnectionPreparationRequest } from './create-connection-preparation.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation';

@Injectable()
@FExecutionRegister(CreateConnectionPreparationRequest)
export class CreateConnectionPreparationExecution
  implements IHandler<CreateConnectionPreparationRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: CreateConnectionPreparationRequest): void {
    if (isNodeOutlet(request.event.targetElement)) {
      this.fMediator.send<void>(new CreateConnectionFromOutletPreparationRequest(request.event));
    } else if (this.isNodeOutput(request.event.targetElement, this.getNode(request.event))) {
      this.fMediator.send<void>(new CreateConnectionFromOutputPreparationRequest(request.event));
    }
  }

  private getNode(event: IPointerEvent): FNodeBase {
    return this.fComponentsStore
      .fNodes.find(n => n.isContains(event.targetElement))!;
  }

  private isNodeOutput(targetElement: HTMLElement, node: FNodeBase): boolean {
    return isNodeOutput(targetElement) && !this.getOutlets(node).length;
  }

  private getOutlets(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutlets.filter((x) => node.isContains(x.hostElement));
  }
}
