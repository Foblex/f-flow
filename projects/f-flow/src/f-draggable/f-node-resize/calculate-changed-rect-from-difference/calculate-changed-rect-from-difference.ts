import { Injectable } from '@angular/core';
import { CalculateChangedRectFromDifferenceRequest } from './calculate-changed-rect-from-difference-request';
import { IPoint, IRect, ISize, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RESIZE_DIRECTIONS } from '../resize-direction';

@Injectable()
@FExecutionRegister(CalculateChangedRectFromDifferenceRequest)
export class CalculateChangedRectFromDifference
  implements IExecution<CalculateChangedRectFromDifferenceRequest, IRect> {

  public handle({ originalRect, difference, handleType, minimumSize }: CalculateChangedRectFromDifferenceRequest): IRect {
    const changedRect = this._changeSizeInRect(originalRect, difference, RESIZE_DIRECTIONS[handleType], minimumSize);

    return this._changePosition(originalRect, difference, RESIZE_DIRECTIONS[handleType], changedRect);
  }

  private _changeSizeInRect(
    originalRect: IRect, difference: IPoint, direction: IPoint, minimumSize: ISize,
  ): IRect {
    let w = originalRect.width + direction.x * difference.x;
    let h = originalRect.height + direction.y * difference.y;

    let rx = 0;
    let ry = 0;

    if (w < 0) {
      rx = w;
      w = Math.abs(w);
    }

    if (w < minimumSize.width) {
      if (direction.x === -1) {
        rx += (w - minimumSize.width);
      }
      w = minimumSize.width;
    }

    if (h < 0) {
      ry = h;
      h = Math.abs(h);
    }

    if (h < minimumSize.height) {
      if (direction.y === -1) {
        ry += (h - minimumSize.height);
      }
      h = minimumSize.height;
    }

    return RectExtensions.initialize(rx, ry, w, h);
  }

  private _changePosition(originalRect: IRect, difference: IPoint, direction: IPoint, changedRect: IRect): IRect {
    const x = originalRect.x + (direction.x === -1 ? difference.x : 0) + changedRect.x;
    const y = originalRect.y + (direction.y === -1 ? difference.y : 0) + changedRect.y;

    return RectExtensions.initialize(
      x, y,
      changedRect.width, changedRect.height,
    );
  }
}
