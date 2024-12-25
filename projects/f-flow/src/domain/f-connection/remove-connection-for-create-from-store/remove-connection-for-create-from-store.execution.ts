import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionForCreateFromStoreRequest } from './remove-connection-for-create-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveConnectionForCreateFromStoreRequest)
export class RemoveConnectionForCreateFromStoreExecution implements IExecution<RemoveConnectionForCreateFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveConnectionForCreateFromStoreRequest): void {
    this._fComponentsStore.fTempConnection = undefined;
  }
}
