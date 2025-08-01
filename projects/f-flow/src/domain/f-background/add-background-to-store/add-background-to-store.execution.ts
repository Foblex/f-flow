import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddBackgroundToStoreRequest } from './add-background-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a background to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddBackgroundToStoreRequest)
export class AddBackgroundToStoreExecution implements IExecution<AddBackgroundToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddBackgroundToStoreRequest): void {
    this._store.fBackground = request.fBackground;
  }
}
