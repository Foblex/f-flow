import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddDndToStoreRequest } from './add-dnd-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddDndToStoreRequest)
export class AddDndToStoreExecution implements IExecution<AddDndToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddDndToStoreRequest): void {
    this._fComponentsStore.fDraggable = request.fComponent;
  }
}
