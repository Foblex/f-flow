import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionToStoreRequest } from './add-connection-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a connection to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddConnectionToStoreRequest)
export class AddConnectionToStoreExecution implements IExecution<AddConnectionToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddConnectionToStoreRequest): void {
    this._store.fConnections.push(request.fConnection);
    this._store.dataChanged();
  }
}
