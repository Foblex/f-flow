import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveNodeFromStoreRequest } from './remove-node-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a node from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveNodeFromStoreRequest)
export class RemoveNodeFromStore
  implements IExecution<RemoveNodeFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveNodeFromStoreRequest): void {
    this._store.removeComponent(this._store.fNodes, request.fComponent);
  }
}
