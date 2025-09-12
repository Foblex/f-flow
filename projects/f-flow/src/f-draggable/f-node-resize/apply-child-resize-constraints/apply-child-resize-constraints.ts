import { Injectable } from '@angular/core';
import { ApplyChildResizeConstraintsRequest } from './apply-child-resize-constraints-request';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(ApplyChildResizeConstraintsRequest)
export class ApplyChildResizeConstraints
  implements IExecution<ApplyChildResizeConstraintsRequest, void> {

  public handle({ rect, childrenBounds }: ApplyChildResizeConstraintsRequest): void {
    if (!childrenBounds) {
return;
}
    this._apply(rect, childrenBounds);
  }

  private _apply(rect: IRect, restrictionsRect: IRect): void {
    this._restrictLeft(rect, restrictionsRect);
    this._restrictTop(rect, restrictionsRect);
    this._restrictRight(rect, restrictionsRect);
    this._restrictBottom(rect, restrictionsRect);

    rect.width = Math.max(0, rect.width);
    rect.height = Math.max(0, rect.height);
  }

  private _restrictLeft(rect: IRect, restrictions: IRect): void {
    const delta = rect.x - restrictions.x;
    if (delta > 0) {
      rect.x -= delta;
      rect.width += delta;
    }
  }

  private _restrictTop(rect: IRect, restrictions: IRect): void {
    const delta = rect.y - restrictions.y;
    if (delta > 0) {
      rect.y -= delta;
      rect.height += delta;
    }
  }

  private _restrictRight(rect: IRect, restrictions: IRect): void {
    const maxRight = restrictions.x + restrictions.width;
    if (rect.x + rect.width <= maxRight) {
      rect.width = maxRight - rect.x;
    }
  }

  private _restrictBottom(rect: IRect, restrictions: IRect): void {
    const maxBottom = restrictions.y + restrictions.height;
    if (rect.y + rect.height <= maxBottom) {
      rect.height = maxBottom - rect.y;
    }
  }
}
