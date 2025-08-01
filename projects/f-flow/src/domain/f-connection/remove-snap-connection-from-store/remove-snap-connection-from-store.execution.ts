import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveSnapConnectionFromStoreRequest } from './remove-snap-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the snap connection from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveSnapConnectionFromStoreRequest)
export class RemoveSnapConnectionFromStoreExecution implements IExecution<RemoveSnapConnectionFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveSnapConnectionFromStoreRequest): void {
    this._store.fSnapConnection = undefined;
  }
}
