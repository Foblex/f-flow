import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { AddNodeToStoreRequest } from './add-node-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { RegisterFCacheNodeRequest } from '../../../f-cache';

/**
 * Execution that adds a Node to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddNodeToStoreRequest)
export class AddNodeToStore implements IExecution<AddNodeToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup }: AddNodeToStoreRequest): void {
    this._store.nodes.add(nodeOrGroup);
    this._mediator.execute(
      new RegisterFCacheNodeRequest(nodeOrGroup.fId(), nodeOrGroup.hostElement, nodeOrGroup),
    );
    this._store.emitNodeChanges();
  }
}
