import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddSnapConnectionToStoreRequest } from './add-snap-connection-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a snap connection to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddSnapConnectionToStoreRequest)
export class AddSnapConnectionToStore implements IExecution<AddSnapConnectionToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: AddSnapConnectionToStoreRequest): void {
    this._store.fSnapConnection = connection;
  }
}
