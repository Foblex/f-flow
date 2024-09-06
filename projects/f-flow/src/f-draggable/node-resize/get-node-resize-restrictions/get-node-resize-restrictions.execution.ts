import { Injectable } from '@angular/core';
import { GetNodeResizeRestrictionsRequest } from './get-node-resize-restrictions.request';
import { IRect } from '@foblex/core';
import { INodeResizeRestrictions } from './i-node-resize-restrictions';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { GetNormalizedParentNodeRectRequest } from '../../domain';
import { GetNormalizedChildrenNodesRectRequest } from '../get-normalized-children-nodes-rect';


@Injectable()
@FExecutionRegister(GetNodeResizeRestrictionsRequest)
export class GetNodeResizeRestrictionsExecution
  implements IExecution<GetNodeResizeRestrictionsRequest, INodeResizeRestrictions> {

  constructor(
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: GetNodeResizeRestrictionsRequest): INodeResizeRestrictions {
    const childRect = this.fMediator.send<IRect | null>(new GetNormalizedChildrenNodesRectRequest(request.fNode, request.rect));
    const parentRect = this.fMediator.send<IRect>(new GetNormalizedParentNodeRectRequest(request.fNode));

    return {
      parentRect,
      childRect,
    }
  }
}
