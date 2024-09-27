import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionToStoreRequest } from './add-connection-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddConnectionToStoreRequest)
export class AddConnectionToStoreExecution implements IExecution<AddConnectionToStoreRequest, void> {

  constructor(
      private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: AddConnectionToStoreRequest): void {
    this.fComponentsStore.fConnections.push(request.fConnection);
    this.fComponentsStore.componentDataChanged();
  }
}
