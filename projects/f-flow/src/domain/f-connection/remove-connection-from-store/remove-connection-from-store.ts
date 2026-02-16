import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveConnectionFromStoreRequest)
export class RemoveConnectionFromStore
  implements IExecution<RemoveConnectionFromStoreRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: RemoveConnectionFromStoreRequest): void {
    this._store.connections.remove(connection);
    this._store.dataChanged();
  }
}
