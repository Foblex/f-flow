import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddOutputToStoreRequest } from './add-output-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds an OutputConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddOutputToStoreRequest)
export class AddOutputToStore implements IExecution<AddOutputToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ component }: AddOutputToStoreRequest): void {
    this._store.addComponent(this._store.fOutputs, component);
  }
}
