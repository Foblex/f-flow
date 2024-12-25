import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddSnapConnectionToStoreRequest } from './add-snap-connection-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddSnapConnectionToStoreRequest)
export class AddSnapConnectionToStoreExecution implements IExecution<AddSnapConnectionToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddSnapConnectionToStoreRequest): void {
    this._fComponentsStore.fSnapConnection = request.fConnection;
  }
}
