import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a connection from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectionFromStoreRequest)
export class RemoveConnectionFromStore
  implements IExecution<RemoveConnectionFromStoreRequest, void>
{
  private _store = inject(FComponentsStore);

  public handle({ connection }: RemoveConnectionFromStoreRequest): void {
    this._store.fConnections.splice(indexOf(this._store.fConnections, connection), 1);
    this._store.dataChanged();
  }
}

function indexOf<T>(array: T[], element: T): number {
  const result = array.indexOf(element);
  if (result === -1) {
    throw new Error(`Connection not found in store`);
  }

  return result;
}
