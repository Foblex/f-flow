import { inject, Injectable } from '@angular/core';
import { GetDeepChildrenNodesAndGroupsRequest } from './get-deep-children-nodes-and-groups-request';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

/**
 * Execution that retrieves all deep children nodes and groups from the FComponentsStore.
 * It traverses the node hierarchy to find all descendants of a given node.
 */
@Injectable()
@FExecutionRegister(GetDeepChildrenNodesAndGroupsRequest)
export class GetDeepChildrenNodesAndGroups implements IExecution<
  GetDeepChildrenNodesAndGroupsRequest,
  FNodeBase[]
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ nodeOrGroupId }: GetDeepChildrenNodesAndGroupsRequest): FNodeBase[] {
    return this._getChildrenNodes(nodeOrGroupId);
  }

  private _getChildrenNodes(nodeOrGroupId: string, visited = new Set<string>()): FNodeBase[] {
    if (visited.has(nodeOrGroupId)) {
      throw new Error(
        'Circular reference detected in the node hierarchy. Node id: ' + nodeOrGroupId,
      );
    }
    visited.add(nodeOrGroupId);

    const directChildren = this._store.nodes
      .getAll()
      .filter((x) => x.fParentId() === nodeOrGroupId);

    return directChildren.reduce((result, x) => {
      return result.concat(this._getChildrenNodes(x.fId(), visited));
    }, directChildren);
  }
}
