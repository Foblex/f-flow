import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddBackgroundToStoreRequest } from './add-background-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddBackgroundToStoreRequest)
export class AddBackgroundToStoreExecution implements IExecution<AddBackgroundToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddBackgroundToStoreRequest): void {
    this._fComponentsStore.fBackground = request.fBackground;
  }
}
