import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveFlowFromStoreRequest } from './remove-flow-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FLayoutController } from '../../../f-layout';

/**
 * Execution that removes a Flow from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveFlowFromStoreRequest)
export class RemoveFlowFromStore implements IExecution<RemoveFlowFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _layoutController = inject(FLayoutController, { optional: true });

  public handle({ instance }: RemoveFlowFromStoreRequest): void {
    this._layoutController?.unregisterFlow(instance.fId());
    this._store.fFlow = undefined;
  }
}
