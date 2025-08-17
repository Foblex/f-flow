import {Injectable} from '@angular/core';
import {CalculateChangedRectFromDifferenceRequest} from './calculate-changed-rect-from-difference-request';
import {IPoint, IRect, RectExtensions} from '@foblex/2d';
import {FExecutionRegister, IExecution} from '@foblex/mediator';
import {RESIZE_DIRECTIONS} from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedRectFromDifferenceRequest)
export class CalculateChangedRectFromDifference
  implements IExecution<CalculateChangedRectFromDifferenceRequest, IRect> {

  public handle(request: CalculateChangedRectFromDifferenceRequest): IRect {
    const {originalRect, difference} = request;
    const changedRect = this._changeSizeInRect(originalRect, difference, RESIZE_DIRECTIONS[request.handleType]);
    return this._changePosition(originalRect, difference, RESIZE_DIRECTIONS[request.handleType], changedRect);
  }

  private _changeSizeInRect(
    originalRect: IRect, difference: IPoint, direction: IPoint
  ): IRect {
    const result = RectExtensions.initialize(
      0, 0,
      originalRect.width + direction.x * difference.x,
      originalRect.height + direction.y * difference.y
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

  private _changePosition(originalRect: IRect, difference: IPoint, direction: IPoint, changedRect: IRect): IRect {
    return RectExtensions.initialize(
      originalRect.x + (direction.x === -1 ? difference.x : 0) + changedRect.x,
      originalRect.y + (direction.y === -1 ? difference.y : 0) + changedRect.y,
      changedRect.width,
      changedRect.height
    );
  }
}
