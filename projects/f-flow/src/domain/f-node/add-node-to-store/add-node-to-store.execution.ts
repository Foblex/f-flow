import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddNodeToStoreRequest } from './add-node-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddNodeToStoreRequest)
export class AddNodeToStoreExecution implements IExecution<AddNodeToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddNodeToStoreRequest): void {
    this._fComponentsStore.addComponent(this._fComponentsStore.fNodes, request.fComponent);
  }
}
