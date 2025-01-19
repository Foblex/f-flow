import { inject, Injectable } from '@angular/core';
import { CalculateNodeMoveRestrictionsRequest } from './calculate-node-move-restrictions.request';
import { IMinMaxPoint, IRect, PointExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedParentNodeRectRequest } from '../../../../domain';
import { FNodeBase } from '../../../../../f-node';
import { GetNormalizedElementRectRequest } from '../../../../../domain';

@Injectable()
@FExecutionRegister(CalculateNodeMoveRestrictionsRequest)
export class CalculateNodeMoveRestrictionsExecution
  implements IExecution<CalculateNodeMoveRestrictionsRequest, IMinMaxPoint> {

  private _fMediator = inject(FMediator);

  public handle(request: CalculateNodeMoveRestrictionsRequest): IMinMaxPoint {
    if(!request.fNode.fParentId || request.hasParentNodeInSelected) {
      return { ...DEFAULT_RESTRICTIONS };
    }

    const fParentNodeRect = this._getParentNodeRect(request.fNode);
    const fCurrentNodeRect = this._getNodeRect(request.fNode);

    return {
      min: PointExtensions.initialize(fParentNodeRect.x - fCurrentNodeRect.x, fParentNodeRect.y - fCurrentNodeRect.y),
      max: PointExtensions.initialize(
        (fParentNodeRect.x + fParentNodeRect.width) - (fCurrentNodeRect.x + fCurrentNodeRect.width),
        (fParentNodeRect.y + fParentNodeRect.height) - (fCurrentNodeRect.y + fCurrentNodeRect.height),
      )
    };
  }

  private _getNodeRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement, false));
  }

  private _getParentNodeRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedParentNodeRectRequest(fNode));
  }
}

const DEFAULT_RESTRICTIONS: IMinMaxPoint = {
  min: PointExtensions.initialize(-Infinity, -Infinity),
  max: PointExtensions.initialize(Infinity, Infinity)
};
