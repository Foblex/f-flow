import { Injectable } from '@angular/core';
import { CalculateChangedSizeRequest } from './calculate-changed-size.request';
import { IPoint, IRect, ISize, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RESIZE_DIRECTIONS } from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedSizeRequest)
export class CalculateChangedSizeExecution
  implements IExecution<CalculateChangedSizeRequest, IRect> {

  public handle(request: CalculateChangedSizeRequest): IRect {
    return this.change(
      request.originalRect,
      request.difference,
      request.minimumSize,
      RESIZE_DIRECTIONS[ request.fResizeHandleType ],
    );
  }

  private change(
    rect: IRect, difference: IPoint, minimumSize: ISize, direction: IPoint
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
