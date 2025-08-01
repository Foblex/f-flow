import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionForCreateFromStoreRequest } from './remove-connection-for-create-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a connection for creation from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectionForCreateFromStoreRequest)
export class RemoveConnectionForCreateFromStoreExecution implements IExecution<RemoveConnectionForCreateFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveConnectionForCreateFromStoreRequest): void {
    this._store.fTempConnection = undefined;
  }
}
