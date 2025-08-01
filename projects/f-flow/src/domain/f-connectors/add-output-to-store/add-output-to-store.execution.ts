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

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddOutputToStoreRequest): void {
    this._fComponentsStore.addComponent(this._fComponentsStore.fOutputs, request.fComponent);
  }
}
