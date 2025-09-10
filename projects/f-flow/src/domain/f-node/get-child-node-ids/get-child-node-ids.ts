import { inject, Injectable } from '@angular/core';
import { GetChildNodeIdsRequest } from './get-child-node-ids.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that retrieves all child nodes of a given node in the Flow.
 */
@Injectable()
@FExecutionRegister(GetChildNodeIdsRequest)
export class GetChildNodeIds
  implements IExecution<GetChildNodeIdsRequest, string[]> {

  private readonly _store = inject(FComponentsStore);

  private get _allNodesAndGroups(): FNodeBase[] {
    return this._store.fNodes;
  }

  public handle(request: GetChildNodeIdsRequest): string[] {
    if (!request.id) {
      return [];
    }
    const visited = new Set<string>();
    const result: string[] = [];
    this._collectDescendants(request.id, result, visited);

    return result;
  }

  private _collectDescendants(nodeId: string, result: string[], visited: Set<string>): void {
    if (visited.has(nodeId)) {
      throw new Error(`Circular reference detected in the node hierarchy. Node id: ${nodeId}`);
    }
    visited.add(nodeId);

    const children = this._allNodesAndGroups.filter(n => n.fParentId() === nodeId).map((x) => x.fId());
    result.push(...children);
    for (const id of children) {
      this._collectDescendants(id, result, visited);
    }
  }
}
