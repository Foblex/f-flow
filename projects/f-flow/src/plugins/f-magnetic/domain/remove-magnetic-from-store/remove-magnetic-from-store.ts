import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveMagneticFromStoreRequest } from './remove-magnetic-from-store-request';
import { FComponentsStore } from '../../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveMagneticFromStoreRequest)
export class RemoveMagneticFromStore implements IExecution<RemoveMagneticFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ name }: RemoveMagneticFromStoreRequest): void {
    this._store.plugins.remove(name);
  }
}
