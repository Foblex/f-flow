import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveFlowFromStoreRequest } from './remove-flow-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveFlowFromStoreRequest)
export class RemoveFlowFromStoreExecution implements IExecution<RemoveFlowFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveFlowFromStoreRequest): void {
    this._fComponentsStore.fFlow = undefined;
  }
}
