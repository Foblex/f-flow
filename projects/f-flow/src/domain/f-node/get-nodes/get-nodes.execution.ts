import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetNodesRequest } from './get-nodes-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(GetNodesRequest)
export class GetNodesExecution implements IExecution<GetNodesRequest, FNodeBase[]> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: GetNodesRequest): FNodeBase[] {
    return this._fComponentsStore.fNodes;
  }
}
