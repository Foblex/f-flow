import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { RemoveConnectionMarkerFromStoreRequest } from './remove-connection-marker-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a connection marker from the FComponentsStore.
 */
@Injectable()
export class RemoveConnectionMarkerFromStore implements IExecution<
  RemoveConnectionMarkerFromStoreRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ instance }: RemoveConnectionMarkerFromStoreRequest): void {
    this._store.connectionMarkers.remove(instance);
    this._store.emitNodeChanges();
  }
}
