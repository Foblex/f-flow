import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddOutputToStoreRequest } from './add-output-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds an OutputConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddOutputToStoreRequest)
export class AddOutputToStoreExecution implements IExecution<AddOutputToStoreRequest, void> {

  private _store = inject(FComponentsStore);

  public handle(request: AddOutputToStoreRequest): void {
    this._store.addComponent(this._store.fOutputs, request.fComponent);
  }
}
