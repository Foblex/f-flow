import { Injectable } from '@angular/core';
import { CalculateChangedSizeRequest } from './calculate-changed-size.request';
import { IPoint, IRect, RectExtensions } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { RESIZE_DIRECTIONS } from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedSizeRequest)
export class CalculateChangedSizeExecution
  implements IExecution<CalculateChangedSizeRequest, IRect> {

  public handle(request: CalculateChangedSizeRequest): IRect {
    return this.change(request.originalRect, request.difference, RESIZE_DIRECTIONS[request.fResizeHandleType]);
  }

  private change(rect: IRect, difference: IPoint, direction: IPoint): IRect {
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
