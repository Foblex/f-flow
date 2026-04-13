import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { RemoveNodeFromStoreRequest } from './remove-node-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { UnregisterFCacheNodeRequest } from '../../../f-cache';

/**
 * Execution that removes a node from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveNodeFromStoreRequest)
export class RemoveNodeFromStore implements IExecution<RemoveNodeFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ instance }: RemoveNodeFromStoreRequest): void {
    this._store.nodes.remove(instance);
    this._mediator.execute(new UnregisterFCacheNodeRequest(instance.fId()));
    this._store.emitNodeChanges();
  }
}
