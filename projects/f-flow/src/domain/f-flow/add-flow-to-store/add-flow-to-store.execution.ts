import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddFlowToStoreRequest } from './add-flow-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddFlowToStoreRequest)
export class AddFlowToStoreExecution implements IExecution<AddFlowToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddFlowToStoreRequest): void {
    this._fComponentsStore.fFlow = request.fComponent;
  }
}
