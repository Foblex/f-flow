import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionForCreateToStoreRequest } from './add-connection-for-create-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a connection for creation to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddConnectionForCreateToStoreRequest)
export class AddConnectionForCreateToStoreExecution implements IExecution<AddConnectionForCreateToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddConnectionForCreateToStoreRequest): void {
    this._store.fTempConnection = request.fConnection;
  }
}
