import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { AddConnectionForCreateToStoreRequest } from './add-connection-for-create-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a connection for creation to the FComponentsStore.
 */
@Injectable()
export class AddConnectionForCreateToStore implements IExecution<
  AddConnectionForCreateToStoreRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: AddConnectionForCreateToStoreRequest): void {
    this._store.connections.addForCreate(connection);
  }
}
