import { Injectable } from '@angular/core';
import { CalculateChangedSizeFromDifferenceRequest } from './calculate-changed-size-from-difference-request';
import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RESIZE_DIRECTIONS } from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedSizeFromDifferenceRequest)
export class CalculateChangedSizeFromDifference
  implements IExecution<CalculateChangedSizeFromDifferenceRequest, IRect> {

  public handle(request: CalculateChangedSizeFromDifferenceRequest): IRect {
    return this.change(
      request.originalRect,
      request.difference,
      RESIZE_DIRECTIONS[ request.handleType ],
    );
  }

  private change(
    rect: IRect, difference: IPoint, direction: IPoint
  ): IRect {
    const result = RectExtensions.initialize(
      0, 0,
      rect.width + direction.x * difference.x,
      rect.height + direction.y * difference.y
    );

    if (result.width < 0) {
      result.x = result.width;
      result.width = Math.abs(result.width);
    }

    if (result.height < 0) {
      result.y = result.height;
      result.height = Math.abs(result.height);
    }

    return RectExtensions.copy(result);
  }
}
