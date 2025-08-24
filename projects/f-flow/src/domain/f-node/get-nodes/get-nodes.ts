import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetNodesRequest } from './get-nodes-request';
import { FComponentsStore } from '../../../f-storage';
import { FNodeBase } from '../../../f-node';

/**
 * Execution that retrieves all nodes from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(GetNodesRequest)
export class GetNodes implements IExecution<GetNodesRequest, FNodeBase[]> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: GetNodesRequest): FNodeBase[] {
    return this._store.fNodes;
  }
}
