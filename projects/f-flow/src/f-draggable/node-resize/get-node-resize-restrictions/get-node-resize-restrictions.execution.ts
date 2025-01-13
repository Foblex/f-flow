import { Injectable } from '@angular/core';
import { GetNodeResizeRestrictionsRequest } from './get-node-resize-restrictions.request';
import { IRect, SizeExtensions } from '@foblex/2d';
import { INodeResizeRestrictions } from './i-node-resize-restrictions';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedParentNodeRectRequest } from '../../domain';
import { GetNormalizedChildrenNodesRectRequest } from '../get-normalized-children-nodes-rect';
import { FNodeBase } from '../../../f-node';
import { GetNodePaddingRequest } from '../../../domain';


@Injectable()
@FExecutionRegister(GetNodeResizeRestrictionsRequest)
export class GetNodeResizeRestrictionsExecution
  implements IExecution<GetNodeResizeRestrictionsRequest, INodeResizeRestrictions> {

  constructor(
    private fMediator: FMediator
  ) {
  }

  public handle(request: GetNodeResizeRestrictionsRequest): INodeResizeRestrictions {
    const fNodePaddings = this.getNodePaddings(request.fNode, request.rect);
    const childRect = this.fMediator.send<IRect | null>(new GetNormalizedChildrenNodesRectRequest(request.fNode, fNodePaddings));
    const parentRect = this.fMediator.send<IRect>(new GetNormalizedParentNodeRectRequest(request.fNode));

    return {
      parentRect,
      childRect,
      minSize: SizeExtensions.initialize(fNodePaddings[0] + fNodePaddings[2], fNodePaddings[1] + fNodePaddings[3])
    }
  }

  private getNodePaddings(node: FNodeBase, rect: IRect): [ number, number, number, number ] {
    return this.fMediator.send<[ number, number, number, number ]>(new GetNodePaddingRequest(node, rect));
  }
}
