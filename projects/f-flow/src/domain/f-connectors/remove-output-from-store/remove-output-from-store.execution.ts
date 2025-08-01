import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveOutputFromStoreRequest } from './remove-output-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes an outlet connector from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveOutputFromStoreRequest)
export class RemoveOutputFromStoreExecution implements IExecution<RemoveOutputFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveOutputFromStoreRequest): void {
    this._store.removeComponent(this._store.fOutputs, request.fComponent);
  }
}
