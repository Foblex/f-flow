import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionMarkerFromStoreRequest } from './remove-connection-marker-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a connection marker from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveConnectionMarkerFromStoreRequest)
export class RemoveConnectionMarkerFromStoreExecution implements IExecution<RemoveConnectionMarkerFromStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: RemoveConnectionMarkerFromStoreRequest): void {
    this._store.removeComponent(this._store.fMarkers, request.fComponent);
  }
}
