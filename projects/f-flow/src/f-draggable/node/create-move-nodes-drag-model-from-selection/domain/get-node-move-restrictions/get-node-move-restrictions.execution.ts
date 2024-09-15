import { Injectable } from '@angular/core';
import { GetNodeMoveRestrictionsRequest } from './get-node-move-restrictions.request';
import { IRect, PointExtensions } from '@foblex/2d';
import { INodeMoveRestrictions } from './i-node-move-restrictions';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedNodeRectRequest, GetNormalizedParentNodeRectRequest } from '../../../../domain';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(GetNodeMoveRestrictionsRequest)
export class GetNodeMoveRestrictionsExecution
  implements IExecution<GetNodeMoveRestrictionsRequest, INodeMoveRestrictions> {

  constructor(
    private fMediator: FMediator
  ) {
  }

  public handle(request: GetNodeMoveRestrictionsRequest): INodeMoveRestrictions {
    if (request.fNode.fParentId && !request.hasParentNodeInSelected) {
      const fParentNodeRect = this.getParentNodeRect(request.fNode);
      const fCurrentNodeRect = this.getCurrentNodeRect(request.fNode);
      return {
        min: PointExtensions.initialize(fParentNodeRect.x - fCurrentNodeRect.x, fParentNodeRect.y - fCurrentNodeRect.y),
        max: PointExtensions.initialize(
          (fParentNodeRect.x + fParentNodeRect.width) - (fCurrentNodeRect.x + fCurrentNodeRect.width),
          (fParentNodeRect.y + fParentNodeRect.height) - (fCurrentNodeRect.y + fCurrentNodeRect.height),
        )
      };
    }
    return { ...DEFAULT_RESTRICTIONS };
  }

  private getCurrentNodeRect(fNode: FNodeBase): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedNodeRectRequest(fNode));
  }

  private getParentNodeRect(fNode: FNodeBase): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedParentNodeRectRequest(fNode));
  }
}

const DEFAULT_RESTRICTIONS: INodeMoveRestrictions = {
  min: PointExtensions.initialize(-Infinity, -Infinity),
  max: PointExtensions.initialize(Infinity, Infinity)
};
