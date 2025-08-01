import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddFlowToStoreRequest } from './add-flow-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a Flow to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddFlowToStoreRequest)
export class AddFlowToStoreExecution implements IExecution<AddFlowToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddFlowToStoreRequest): void {
    this._store.fFlow = request.fComponent;
  }
}
