import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FCreateConnectionFromOutputPreparationRequest } from './f-create-connection-from-output-preparation.request';
import { FConnectorBase, FNodeOutputBase, isNodeOutput } from '../../../../../f-connectors';
import { FCreateConnectionDragHandlerPreparationRequest } from '../drag-handler-preparation';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(FCreateConnectionFromOutputPreparationRequest)
export class FCreateConnectionFromOutputPreparationExecution
  implements IHandler<FCreateConnectionFromOutputPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _store = inject(FComponentsStore);

  public handle(request: FCreateConnectionFromOutputPreparationRequest): void {
    if(!this._isValid(request)) {
      return;
    }
    const fOutput = this._getOutput(request.event.targetElement);

    if (fOutput.canBeConnected) {
      this._fMediator.execute(
        new FCreateConnectionDragHandlerPreparationRequest(request.event.getPosition(), fOutput),
      );
    }
  }

  private _isValid(request: FCreateConnectionFromOutputPreparationRequest): boolean {
    return this._isNodeOutput(request.event.targetElement, request.fNode);
  }

  private _isNodeOutput(element: HTMLElement, fNode: FNodeBase): boolean {
    return isNodeOutput(element) && !this._getNodeOutlets(fNode).length;
  }

  private _getNodeOutlets(node: FNodeBase): FConnectorBase[] {
    return this._store.fOutlets
      .filter((x) => node.isContains(x.hostElement));
  }

  private _getOutput(element: Element): FNodeOutputBase {
    const result = this._store.fOutputs
      .find((x) => x.hostElement.contains(element));
    if (!result) {
      throw new Error('Output not found');
    }

    return result as FNodeOutputBase;
  }
}
