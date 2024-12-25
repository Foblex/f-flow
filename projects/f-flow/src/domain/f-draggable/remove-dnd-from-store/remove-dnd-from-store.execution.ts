import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveDndFromStoreRequest } from './remove-dnd-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveDndFromStoreRequest)
export class RemoveDndFromStoreExecution implements IExecution<RemoveDndFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveDndFromStoreRequest): void {
    this._fComponentsStore.fDraggable = undefined;
  }
}
