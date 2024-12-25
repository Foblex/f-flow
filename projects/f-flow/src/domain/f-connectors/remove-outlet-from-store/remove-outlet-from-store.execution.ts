import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveOutletFromStoreRequest } from './remove-outlet-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveOutletFromStoreRequest)
export class RemoveOutletFromStoreExecution implements IExecution<RemoveOutletFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveOutletFromStoreRequest): void {
    this._fComponentsStore.removeComponent(this._fComponentsStore.fOutlets, request.fComponent);
  }
}
