import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveOutputFromStoreRequest } from './remove-output-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveOutputFromStoreRequest)
export class RemoveOutputFromStoreExecution implements IExecution<RemoveOutputFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveOutputFromStoreRequest): void {
    this._fComponentsStore.removeComponent(this._fComponentsStore.fOutputs, request.fComponent);
  }
}
