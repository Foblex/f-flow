import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation-request';
import { FConnectorBase, FNodeOutputBase, isNodeOutput } from '../../../../../f-connectors';
import { FCreateConnectionDragHandlerPreparationRequest } from '../drag-handler-preparation';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparation
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle(request: CreateConnectionFromOutputPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }
    const fOutput = this._getOutput(request.event.targetElement);

    if (fOutput.canBeConnected) {
      this._mediator.execute(
        new FCreateConnectionDragHandlerPreparationRequest(request.event.getPosition(), fOutput),
      );
    }
  }

  private _isValid(request: CreateConnectionFromOutputPreparationRequest): boolean {
    return this._isNodeOutput(request.event.targetElement, request.node);
  }

  private _isNodeOutput(element: HTMLElement, fNode: FNodeBase): boolean {
    return isNodeOutput(element) && !this._getNodeOutlets(fNode).length;
  }

  private _getNodeOutlets(node: FNodeBase): FConnectorBase[] {
    return this._store.fOutlets.filter((x) => node.isContains(x.hostElement));
  }

  private _getOutput(element: Element): FNodeOutputBase {
    const result = this._store.fOutputs.find((x) => x.hostElement.contains(element));
    if (!result) {
      throw new Error('Output not found');
    }

    return result as FNodeOutputBase;
  }
}
