import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddOutletToStoreRequest } from './add-outlet-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddOutletToStoreRequest)
export class AddOutletToStoreExecution implements IExecution<AddOutletToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddOutletToStoreRequest): void {
    this._fComponentsStore.addComponent(this._fComponentsStore.fOutlets, request.fComponent);
  }
}
