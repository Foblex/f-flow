import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveInputFromStoreRequest } from './remove-input-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveInputFromStoreRequest)
export class RemoveInputFromStoreExecution implements IExecution<RemoveInputFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveInputFromStoreRequest): void {
    this._fComponentsStore.removeComponent(this._fComponentsStore.fInputs, request.fComponent);
  }
}
