import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionForCreateToStoreRequest } from './add-connection-for-create-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddConnectionForCreateToStoreRequest)
export class AddConnectionForCreateToStoreExecution implements IExecution<AddConnectionForCreateToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddConnectionForCreateToStoreRequest): void {
    this._fComponentsStore.fTempConnection = request.fConnection;
  }
}
