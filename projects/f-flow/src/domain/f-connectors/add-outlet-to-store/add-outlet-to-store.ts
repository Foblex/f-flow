import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddOutletToStoreRequest } from './add-outlet-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds an OutletConnector to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddOutletToStoreRequest)
export class AddOutletToStore implements IExecution<AddOutletToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ component }: AddOutletToStoreRequest): void {
    this._store.addComponent(this._store.fOutlets, component);
  }
}
