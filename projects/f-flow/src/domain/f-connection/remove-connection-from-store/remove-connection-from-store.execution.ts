import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase } from '../../../f-connection/common';

/**
 * Execution that removes a connection from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectionFromStoreRequest)
export class RemoveConnectionFromStoreExecution implements IExecution<RemoveConnectionFromStoreRequest, void> {

  private _store = inject(FComponentsStore);

  public handle(request: RemoveConnectionFromStoreRequest): void {
    this._store.fConnections.splice(this._getIndexOfConnection(request.fConnection), 1);
    this._store.dataChanged();
  }

  private _getIndexOfConnection(fConnection: FConnectionBase): number {
    const result = this._store.fConnections.indexOf(fConnection);
    if (result === -1) {
      throw new Error(`Connection not found in store`);
    }

    return result;
  }
}
