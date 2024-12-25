import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveNodeFromStoreRequest } from './remove-node-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveNodeFromStoreRequest)
export class RemoveNodeFromStoreExecution implements IExecution<RemoveNodeFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveNodeFromStoreRequest): void {
    this._fComponentsStore.removeComponent(this._fComponentsStore.fNodes, request.fComponent);
  }
}
