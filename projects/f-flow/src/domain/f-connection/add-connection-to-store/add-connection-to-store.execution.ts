import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionToStoreRequest } from './add-connection-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddConnectionToStoreRequest)
export class AddConnectionToStoreExecution implements IExecution<AddConnectionToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddConnectionToStoreRequest): void {
    this._fComponentsStore.fConnections.push(request.fConnection);
    this._fComponentsStore.dataChanged();
  }
}
