import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveSnapConnectionFromStoreRequest } from './remove-snap-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveSnapConnectionFromStoreRequest)
export class RemoveSnapConnectionFromStoreExecution implements IExecution<RemoveSnapConnectionFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveSnapConnectionFromStoreRequest): void {
    this._fComponentsStore.fSnapConnection = undefined;
  }
}
