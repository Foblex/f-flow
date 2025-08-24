import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddNodeToStoreRequest } from './add-node-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a Node to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddNodeToStoreRequest)
export class AddNodeToStore implements IExecution<AddNodeToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddNodeToStoreRequest): void {
    this._store.addComponent(this._store.fNodes, request.fComponent);
  }
}
