import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionMarkerToStoreRequest } from './add-connection-marker-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a connection marker to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddConnectionMarkerToStoreRequest)
export class AddConnectionMarkerToStoreExecution implements IExecution<AddConnectionMarkerToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddConnectionMarkerToStoreRequest): void {
    this._store.addComponent(this._store.fMarkers, request.fComponent);
  }
}
