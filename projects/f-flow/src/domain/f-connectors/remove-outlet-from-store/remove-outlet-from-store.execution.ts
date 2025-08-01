import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveOutletFromStoreRequest } from './remove-outlet-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes an outlet connector from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveOutletFromStoreRequest)
export class RemoveOutletFromStoreExecution implements IExecution<RemoveOutletFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveOutletFromStoreRequest): void {
    this._store.removeComponent(this._store.fOutlets, request.fComponent);
  }
}
