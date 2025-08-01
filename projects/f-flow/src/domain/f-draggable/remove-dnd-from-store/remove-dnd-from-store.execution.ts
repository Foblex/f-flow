import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveDndFromStoreRequest } from './remove-dnd-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the drag and drop directive from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveDndFromStoreRequest)
export class RemoveDndFromStoreExecution implements IExecution<RemoveDndFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveDndFromStoreRequest): void {
    this._store.fDraggable = undefined;
  }
}
