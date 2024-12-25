import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddInputToStoreRequest } from './add-input-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddInputToStoreRequest)
export class AddInputToStoreExecution implements IExecution<AddInputToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddInputToStoreRequest): void {
    this._fComponentsStore.addComponent(this._fComponentsStore.fInputs, request.fComponent);
  }
}
