import { Injectable } from '@angular/core';
import { ApplyChildResizeConstraintsRequest } from './apply-child-resize-constraints-request';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(ApplyChildResizeConstraintsRequest)
export class ApplyChildResizeConstraints
  implements IExecution<ApplyChildResizeConstraintsRequest, void> {

  public handle({rect, childrenBounds}: ApplyChildResizeConstraintsRequest): void {
    if (!childrenBounds) return;
    this._apply(rect, childrenBounds);
  }

  /** Clamp child rect so it stays fully inside restrictionsRect on all sides. */
  private _apply(rect: IRect, restrictionsRect: IRect): void {
    this._restrictLeft(rect, restrictionsRect);
    this._restrictTop(rect, restrictionsRect);
    this._restrictRight(rect, restrictionsRect);
    this._restrictBottom(rect, restrictionsRect);

    // Ensure non-negative size after all corrections.
    rect.width = Math.max(0, rect.width);
    rect.height = Math.max(0, rect.height);
  }

  /** If left edge is outside to the left, move inside and reduce width accordingly. */
  private _restrictLeft(rect: IRect, restrictions: IRect): void {
    if (rect.x < restrictions.x) {
      const diff = restrictions.x - rect.x;
      rect.x += diff;
      rect.width -= diff;
    }
  }

  /** If top edge is outside above, move inside and reduce height accordingly. */
  private _restrictTop(rect: IRect, restrictions: IRect): void {
    if (rect.y < restrictions.y) {
      const diff = restrictions.y - rect.y;
      rect.y += diff;
      rect.height -= diff;
    }
  }

  /** If right edge overflows, shrink width to fit maxRight. */
  private _restrictRight(rect: IRect, restrictions: IRect): void {
    const maxRight = restrictions.x + restrictions.width;
    const right = rect.x + rect.width;
    if (right > maxRight) {
      rect.width = maxRight - rect.x;
    }
  }

  /** If bottom edge overflows, shrink height to fit maxBottom. */
  private _restrictBottom(rect: IRect, restrictions: IRect): void {
    const maxBottom = restrictions.y + restrictions.height;
    const bottom = rect.y + rect.height;
    if (bottom > maxBottom) {
      rect.height = maxBottom - rect.y;
    }
  }
}
