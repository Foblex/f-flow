import { Injectable } from '@angular/core';
import { IsArrayHasParentNodeRequest } from './is-array-has-parent-node.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';
import { GetParentNodesRequest } from '../../../domain/f-node/get-parent-nodes';

@Injectable()
@FExecutionRegister(IsArrayHasParentNodeRequest)
export class IsArrayHasParentNodeExecution
  implements IExecution<IsArrayHasParentNodeRequest, boolean> {

  constructor(
    private fMediator: FMediator
  ) {
  }

  public handle(request: IsArrayHasParentNodeRequest): boolean {
    return this.isParentNodeInArray(this.getParentNodeIds(request.fNode), request.fNodes);
  }

  private getParentNodeIds(fNode: FNodeBase): string[] {
    return this.getParentNodes(fNode).map((x) => x.fId);
  }

  private getParentNodes(fNode: FNodeBase): FNodeBase[] {
    return this.fMediator.send<FNodeBase[]>(new GetParentNodesRequest(fNode));
  }

  private isParentNodeInArray(parentNodeIds: string[], fNodes: FNodeBase[]): boolean {
    return fNodes.some((x) => parentNodeIds.includes(x.fId));
  }
}


