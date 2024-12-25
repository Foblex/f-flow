import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveConnectionMarkerFromStoreRequest } from './remove-connection-marker-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveConnectionMarkerFromStoreRequest)
export class RemoveConnectionMarkerFromStoreExecution implements IExecution<RemoveConnectionMarkerFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveConnectionMarkerFromStoreRequest): void {
    this._fComponentsStore.removeComponent(this._fComponentsStore.fMarkers, request.fComponent);
  }
}
