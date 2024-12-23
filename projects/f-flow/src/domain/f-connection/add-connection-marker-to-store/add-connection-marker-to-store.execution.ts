import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddConnectionMarkerToStoreRequest } from './add-connection-marker-to-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(AddConnectionMarkerToStoreRequest)
export class AddConnectionMarkerToStoreExecution implements IExecution<AddConnectionMarkerToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddConnectionMarkerToStoreRequest): void {
    this._fComponentsStore.addComponent(this._fComponentsStore.fMarkers, request.fComponent);
  }
}
