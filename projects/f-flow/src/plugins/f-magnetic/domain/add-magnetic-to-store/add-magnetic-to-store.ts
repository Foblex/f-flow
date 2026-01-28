import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddMagneticToStoreRequest } from './add-magnetic-to-store-request';
import { FComponentsStore } from '../../../../f-storage';

@Injectable()
@FExecutionRegister(AddMagneticToStoreRequest)
export class AddMagneticToStore implements IExecution<AddMagneticToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ instance, name }: AddMagneticToStoreRequest): void {
    this._store.fComponents[name] = instance;
  }
}
