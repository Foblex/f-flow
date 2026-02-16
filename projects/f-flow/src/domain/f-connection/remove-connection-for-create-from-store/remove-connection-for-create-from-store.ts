import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionForCreateFromStoreRequest } from './remove-connection-for-create-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a connection for creation from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectionForCreateFromStoreRequest)
export class RemoveConnectionForCreateFromStore
  implements IExecution<RemoveConnectionForCreateFromStoreRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  public handle(_request: RemoveConnectionForCreateFromStoreRequest): void {
    this._store.connections.removeInstanceForCreate();
  }
}
