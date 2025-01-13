import { inject, Injectable } from '@angular/core';
import { GetParentNodesRequest } from './get-parent-nodes.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(GetParentNodesRequest)
export class GetParentNodesExecution
  implements IExecution<GetParentNodesRequest, FNodeBase[]> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: GetParentNodesRequest): FNodeBase[] {
    return this._getParentNodes(request.fNode, new Set<string>(), []);
  }

  private _getParentNodes(fNode: FNodeBase, visited: Set<string>, result: FNodeBase[]): FNodeBase[] {
    if (visited.has(fNode.fId)) {
      throw new Error('Circular reference detected in the node hierarchy. Node id: ' + fNode.fId);
    }
    visited.add(fNode.fId);

    const parent = this._fComponentsStore.fNodes.find((x) => x.fId === fNode.fParentId);
    if (!parent) {
      return result;
    }

    result.push(parent);
    return this._getParentNodes(parent, visited, result);
  }
}
