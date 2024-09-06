import { Injectable } from '@angular/core';
import { GetChildrenNodesRequest } from './get-children-nodes.request';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(GetChildrenNodesRequest)
export class GetChildrenNodesExecution
  implements IExecution<GetChildrenNodesRequest, FNodeBase[]> {

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: GetChildrenNodesRequest): FNodeBase[] {
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
