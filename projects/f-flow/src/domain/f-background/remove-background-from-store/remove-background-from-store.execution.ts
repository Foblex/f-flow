import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveBackgroundFromStoreRequest } from './remove-background-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the background from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveBackgroundFromStoreRequest)
export class RemoveBackgroundFromStoreExecution implements IExecution<RemoveBackgroundFromStoreRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveBackgroundFromStoreRequest): void {
    this._fComponentsStore.fBackground = undefined;
  }
}
