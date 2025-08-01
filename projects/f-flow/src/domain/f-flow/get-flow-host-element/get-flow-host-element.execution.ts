import { GetFlowHostElementRequest } from './get-flow-host-element.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that retrieves the Flow host element from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(GetFlowHostElementRequest)
export class GetFlowHostElementExecution implements IExecution<GetFlowHostElementRequest, HTMLElement> {

  private readonly _store = inject(FComponentsStore);

  public handle(): HTMLElement {
    return this._store.flowHost;
  }
}
