import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveFlowFromStoreRequest } from './remove-flow-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a Flow from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveFlowFromStoreRequest)
export class RemoveFlowFromStore implements IExecution<RemoveFlowFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: RemoveFlowFromStoreRequest): void {
    this._store.fFlow = undefined;
  }
}
