import { Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation.request';
import { IPointerEvent } from '@foblex/core';
import { FValidatorRegister, IValidator } from '../../../../../infrastructure';
import { FComponentsStore } from '../../../../../f-storage';
import { FNodeBase } from '../../../../../f-node';
import { FConnectorBase, isNodeOutput } from '../../../../../f-connectors';

@Injectable()
@FValidatorRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparationValidator implements IValidator<CreateConnectionFromOutputPreparationRequest> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: CreateConnectionFromOutputPreparationRequest): boolean {
    return this.isNodeOutput(request.event.targetElement, this.getNode(request.event));
  }

  private getNode(event: IPointerEvent): FNodeBase {
    return this.fComponentsStore.findNode(event.targetElement)!;
  }

  private isNodeOutput(targetElement: HTMLElement, node: FNodeBase): boolean {
    return isNodeOutput(targetElement) && !this.getOutlets(node).length;
  }

  private getOutlets(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutlets.filter((x) => node.isContains(x.hostElement));
  }
}
