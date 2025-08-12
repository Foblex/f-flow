import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddOutletToStoreRequest } from './add-outlet-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds an OutletConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddOutletToStoreRequest)
export class AddOutletToStoreExecution implements IExecution<AddOutletToStoreRequest, void> {

  private _store = inject(FComponentsStore);

  public handle(request: AddOutletToStoreRequest): void {
    this._store.addComponent(this._store.fOutlets, request.fComponent);
  }
}
