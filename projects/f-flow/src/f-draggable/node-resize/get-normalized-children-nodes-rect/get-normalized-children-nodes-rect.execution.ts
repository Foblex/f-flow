import { Injectable } from '@angular/core';
import { GetNormalizedChildrenNodesRectRequest } from './get-normalized-children-nodes-rect.request';
import { IRect, RectExtensions } from '@foblex/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FNodeBase } from '../../../f-node';
import { GetChildrenNodesRequest, GetNodePaddingRequest, GetNormalizedNodeRectRequest } from '../../domain';

@Injectable()
@FExecutionRegister(GetNormalizedChildrenNodesRectRequest)
export class GetNormalizedChildrenNodesRectExecution
  implements IExecution<GetNormalizedChildrenNodesRectRequest, IRect | null> {

  constructor(
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: GetNormalizedChildrenNodesRectRequest): IRect | null {
    const childNodeRect = RectExtensions.union(
      this.getChildrenNodes(request.fNode.fId).map((x) => this.normalizeRect(x))
    );
    return childNodeRect ?
      this.concatRectWithParentPadding(childNodeRect,
        this.getNodePadding(request.fNode, request.rect)
      ) : null;
  }

  private getChildrenNodes(fId: string): FNodeBase[] {
    return this.fMediator.send<FNodeBase[]>(new GetChildrenNodesRequest(fId));
  }

  private normalizeRect(node: FNodeBase): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedNodeRectRequest(node));
  }

  private getNodePadding(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this.fMediator.send<[ number, number, number, number ]>(new GetNodePaddingRequest(node, rect));
  }

  private concatRectWithParentPadding(rect: IRect, padding: [ number, number, number, number ]): IRect {
    return RectExtensions.initialize(
      rect.x - padding[0],
      rect.y - padding[1],
      rect.width + padding[0] + padding[2],
      rect.height + + padding[1] + padding[3]
    );
  }
}
