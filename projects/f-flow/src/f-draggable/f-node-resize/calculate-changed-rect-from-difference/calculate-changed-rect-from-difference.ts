import { Injectable } from '@angular/core';
import { CalculateChangedRectFromDifferenceRequest } from './calculate-changed-rect-from-difference-request';
import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RESIZE_DIRECTIONS } from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedRectFromDifferenceRequest)
export class CalculateChangedRectFromDifference
  implements IExecution<CalculateChangedRectFromDifferenceRequest, IRect> {

  public handle(request: CalculateChangedRectFromDifferenceRequest): IRect {
    return this.change(
      request.originalRect, request.difference,
      RESIZE_DIRECTIONS[ request.handleType ], request.changedRect,
    );
  }

  private change(originalRect: IRect, difference: IPoint, direction: IPoint, changedRect: IRect): IRect {
    return RectExtensions.initialize(
      originalRect.x + (direction.x === -1 ? difference.x : 0) + changedRect.x,
      originalRect.y + (direction.y === -1 ? difference.y : 0) + changedRect.y,
      changedRect.width,
      changedRect.height
    );
  }
}
