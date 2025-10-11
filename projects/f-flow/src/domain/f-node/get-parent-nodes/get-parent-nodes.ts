import { inject, Injectable } from '@angular/core';
import { GetParentNodesRequest } from './get-parent-nodes.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that retrieves all parent nodes of a given node from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(GetParentNodesRequest)
export class GetParentNodes implements IExecution<GetParentNodesRequest, FNodeBase[]> {
  private readonly _store = inject(FComponentsStore);

  public handle({ nodeOrGroup }: GetParentNodesRequest): FNodeBase[] {
    return this._getParentNodes(nodeOrGroup, new Set<string>(), []);
  }

  private _getParentNodes(
    nodeOrGroup: FNodeBase,
    visited: Set<string>,
    result: FNodeBase[],
  ): FNodeBase[] {
    if (visited.has(nodeOrGroup.fId())) {
      throw new Error(
        'Circular reference detected in the node hierarchy. Node id: ' + nodeOrGroup.fId(),
      );
    }
    visited.add(nodeOrGroup.fId());

    const parent = this._store.fNodes.find((x) => x.fId() === nodeOrGroup.fParentId());
    if (!parent) {
      return result;
    }

    result.push(parent);

    return this._getParentNodes(parent, visited, result);
  }
}
