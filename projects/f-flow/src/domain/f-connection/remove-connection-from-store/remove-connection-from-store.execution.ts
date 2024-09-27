import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveConnectionFromStoreRequest)
export class RemoveConnectionFromStoreExecution implements IExecution<RemoveConnectionFromStoreRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: RemoveConnectionFromStoreRequest): void {
    const index = this.fComponentsStore.fConnections.indexOf(request.fConnection);
    if (index === -1) {
      throw new Error(`Connection not found in store`);
    }
    this.fComponentsStore.fConnections.splice(index, 1);
    this.fComponentsStore.componentDataChanged();
  }
}
