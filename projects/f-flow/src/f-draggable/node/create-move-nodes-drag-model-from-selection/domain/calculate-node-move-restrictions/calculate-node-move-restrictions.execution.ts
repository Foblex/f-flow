import { inject, Injectable } from '@angular/core';
import { CalculateNodeMoveRestrictionsRequest } from './calculate-node-move-restrictions.request';
import { IMinMaxPoint, IPoint, IRect, PointExtensions } from '@foblex/2d';
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

    return this._calculateDifference(
      this._fParentRect(request.fNode), this._fNodeRect(request.fNode)
    );
  }

  private _fNodeRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement, false));
  }

  private _fParentRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedParentNodeRectRequest(fNode));
  }

  private _calculateDifference(fParentRect: IRect, fRect: IRect): IMinMaxPoint {
    return {
      min: this._calculateMinimumDifference(fParentRect, fRect),
      max: this._calculateMaximumDifference(fParentRect, fRect)
    };
  }

  private _calculateMinimumDifference(fParentRect: IRect, fRect: IRect): IPoint {
    return PointExtensions.initialize(fParentRect.x - fRect.x, fParentRect.y - fRect.y);
  }

  private _calculateMaximumDifference(fParentRect: IRect, fRect: IRect): IPoint {
    return PointExtensions.initialize(
      (fParentRect.x + fParentRect.width) - (fRect.x + fRect.width),
      (fParentRect.y + fParentRect.height) - (fRect.y + fRect.height),
    );
  }
}

const DEFAULT_RESTRICTIONS: IMinMaxPoint = {
  min: PointExtensions.initialize(-Infinity, -Infinity),
  max: PointExtensions.initialize(Infinity, Infinity)
};
