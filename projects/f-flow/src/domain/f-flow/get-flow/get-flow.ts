import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetFlowRequest } from './get-flow-request';
import { FComponentsStore } from '../../../f-storage';
import { FFlowBase } from '../../../f-flow';

/**
 * Execution that retrieves the current Flow from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(GetFlowRequest)
export class GetFlow implements IExecution<GetFlowRequest, FFlowBase> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: GetFlowRequest): FFlowBase {
    const result = this._store.fFlow;
    if (!result) {
      throw new Error(`Flow not found in store`);
    }

    return result;
  }
}
