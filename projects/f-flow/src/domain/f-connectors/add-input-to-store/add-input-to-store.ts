import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddInputToStoreRequest } from './add-input-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds an InputConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddInputToStoreRequest)
export class AddInputToStore implements IExecution<AddInputToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ component }: AddInputToStoreRequest): void {
    this._store.addComponent(this._store.fInputs, component);
  }
}
