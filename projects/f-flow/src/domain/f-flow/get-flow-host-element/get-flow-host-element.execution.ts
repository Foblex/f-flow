import { GetFlowHostElementRequest } from './get-flow-host-element.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(GetFlowHostElementRequest)
export class GetFlowHostElementExecution implements IExecution<GetFlowHostElementRequest, HTMLElement> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(): HTMLElement {
    return this._fComponentsStore.flowHost;
  }
}
