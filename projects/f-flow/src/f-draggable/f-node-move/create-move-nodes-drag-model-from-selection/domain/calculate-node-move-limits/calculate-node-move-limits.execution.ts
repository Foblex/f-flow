import {inject, Injectable} from '@angular/core';
import {CalculateNodeMoveLimitsRequest} from './calculate-node-move-limits.request';
import {IPoint, IRect, PointExtensions} from '@foblex/2d';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {GetNormalizedParentNodeRectRequest} from '../../../../domain';
import {FNodeBase} from '../../../../../f-node';
import {GetNormalizedElementRectRequest} from '../../../../../domain';
import {INodeMoveLimits} from '../../i-node-move-limits';
import {infinityMinMax} from "../../../../../utils";

@Injectable()
@FExecutionRegister(CalculateNodeMoveLimitsRequest)
export class CalculateNodeMoveLimitsExecution
  implements IExecution<CalculateNodeMoveLimitsRequest, INodeMoveLimits> {

  private _fMediator = inject(FMediator);

  public handle(request: CalculateNodeMoveLimitsRequest): INodeMoveLimits {
    if (!request.fNode.fParentId() || request.hasParentNodeInSelected) {
      return {...infinityMinMax()};
    }

    return this._calculateDifference(
      this._fParentRect(request.fNode), this._fNodeRect(request.fNode)
    );
  }

  private _fNodeRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(fNode.hostElement));
  }

  private _fParentRect(fNode: FNodeBase): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedParentNodeRectRequest(fNode));
  }

  private _calculateDifference(fParentRect: IRect, fRect: IRect): INodeMoveLimits {
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
