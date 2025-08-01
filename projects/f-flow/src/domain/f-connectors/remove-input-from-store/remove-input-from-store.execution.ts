import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveInputFromStoreRequest } from './remove-input-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes an inputConnector from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveInputFromStoreRequest)
export class RemoveInputFromStoreExecution implements IExecution<RemoveInputFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveInputFromStoreRequest): void {
    this._store.removeComponent(this._store.fInputs, request.fComponent);
  }
}
