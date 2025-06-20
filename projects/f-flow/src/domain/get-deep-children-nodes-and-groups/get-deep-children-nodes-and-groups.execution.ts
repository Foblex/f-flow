import {inject, Injectable} from '@angular/core';
import { GetDeepChildrenNodesAndGroupsRequest } from './get-deep-children-nodes-and-groups.request';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(GetDeepChildrenNodesAndGroupsRequest)
export class GetDeepChildrenNodesAndGroupsExecution
  implements IExecution<GetDeepChildrenNodesAndGroupsRequest, FNodeBase[]> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: GetDeepChildrenNodesAndGroupsRequest): FNodeBase[] {
    return this._getChildrenNodes(request.fId);
  }

  private _getChildrenNodes(fId: string, visited: Set<string> = new Set()): FNodeBase[] {
    if (visited.has(fId)) {
      throw new Error('Circular reference detected in the node hierarchy. Node id: ' + fId);
    }
    visited.add(fId);

    const directChildren = this._fComponentsStore.fNodes.filter((x) => x.fParentId === fId);
    return directChildren.reduce((result, x) => {
      return result.concat(this._getChildrenNodes(x.fId, visited));
    }, directChildren);
  }
}
