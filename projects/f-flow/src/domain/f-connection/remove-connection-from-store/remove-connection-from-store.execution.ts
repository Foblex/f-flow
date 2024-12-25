import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase } from '../../../f-connection/common';

@Injectable()
@FExecutionRegister(RemoveConnectionFromStoreRequest)
export class RemoveConnectionFromStoreExecution implements IExecution<RemoveConnectionFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveConnectionFromStoreRequest): void {
    this._fComponentsStore.fConnections.splice(this._getIndexOfConnection(request.fConnection), 1);
    this._fComponentsStore.componentDataChanged();
  }

  private _getIndexOfConnection(fConnection: FConnectionBase): number {
    const result = this._fComponentsStore.fConnections.indexOf(fConnection);
    if (result === -1) {
      throw new Error(`Connection not found in store`);
    }
    return result;
  }
}
