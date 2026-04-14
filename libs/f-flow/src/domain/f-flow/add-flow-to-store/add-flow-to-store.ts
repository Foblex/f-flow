import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddFlowToStoreRequest } from './add-flow-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { FLayoutController } from '../../../f-layout';

/**
 * Execution that adds a Flow to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddFlowToStoreRequest)
export class AddFlowToStore implements IExecution<AddFlowToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _layoutController = inject(FLayoutController, { optional: true });

  public handle({ instance }: AddFlowToStoreRequest): void {
    this._store.fFlow = instance;
    this._layoutController?.registerFlow(instance, this._store);
  }
}
