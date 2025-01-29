import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation.request';
import { FConnectorBase, FNodeOutputBase, isNodeOutput } from '../../../../../f-connectors';
import { CreateConnectionDragHandlerPreparationRequest } from '../create-connection-drag-handler-preparation';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparationExecution
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: CreateConnectionFromOutputPreparationRequest): void {
    if(!this._isValid(request)) {
      return;
    }
    const fOutput = this._getOutput(request.event.targetElement);

    if (fOutput.canBeConnected) {
      this._fMediator.execute(
        new CreateConnectionDragHandlerPreparationRequest(request.event.getPosition(), fOutput)
      );
    }
  }

  private _isValid(request: CreateConnectionFromOutputPreparationRequest): boolean {
    return this._isNodeOutput(request.event.targetElement, request.fNode);
  }

  private _isNodeOutput(element: HTMLElement, fNode: FNodeBase): boolean {
    return isNodeOutput(element) && !this._getNodeOutlets(fNode).length;
  }

  private _getNodeOutlets(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutlets
      .filter((x) => node.isContains(x.hostElement));
  }

  private _getOutput(element: Element): FNodeOutputBase {
    const result = this._fComponentsStore.fOutputs
      .find((x) => x.hostElement.contains(element));
    if (!result) {
      throw new Error('Output not found');
    }
    return result as FNodeOutputBase;
  }
}
