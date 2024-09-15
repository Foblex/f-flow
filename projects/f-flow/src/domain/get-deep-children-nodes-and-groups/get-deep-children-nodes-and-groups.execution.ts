import { Injectable } from '@angular/core';
import { GetDeepChildrenNodesAndGroupsRequest } from './get-deep-children-nodes-and-groups.request';
import { FComponentsStore } from '../../f-storage';
import { FNodeBase } from '../../f-node';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(GetDeepChildrenNodesAndGroupsRequest)
export class GetDeepChildrenNodesAndGroupsExecution
  implements IExecution<GetDeepChildrenNodesAndGroupsRequest, FNodeBase[]> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: GetDeepChildrenNodesAndGroupsRequest): FNodeBase[] {
    return this.getChildrenNodes(request.fId);
  }

  private getChildrenNodes(fId: string, visited: Set<string> = new Set()): FNodeBase[] {
    if (visited.has(fId)) {
      throw new Error('Circular reference detected in the node hierarchy. Node id: ' + fId);
    }
    visited.add(fId);

    const result = this.fComponentsStore.fNodes.filter((x) => x.fParentId === fId);
    result.forEach((x) => {
      result.push(...this.getChildrenNodes(x.fId, visited));
    });
    return result;
  }
}
