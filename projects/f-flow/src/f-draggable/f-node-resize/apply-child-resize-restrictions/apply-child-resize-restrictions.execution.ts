import { Injectable } from '@angular/core';
import { ApplyChildResizeRestrictionsRequest } from './apply-child-resize-restrictions.request';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

const CHILD_RESIZE_OFFSET = 0;

@Injectable()
@FExecutionRegister(ApplyChildResizeRestrictionsRequest)
export class ApplyChildResizeRestrictionsExecution
  implements IExecution<ApplyChildResizeRestrictionsRequest, void> {

  public handle(request: ApplyChildResizeRestrictionsRequest): void {
    this._apply(request.rect, request.restrictions.childrenBounds!);
  }

  private _apply(rect: IRect, restrictionsRect: IRect): void {
    this._restrictLeft(rect, restrictionsRect);
    this._restrictTop(rect, restrictionsRect);
    this._restrictRight(rect, restrictionsRect);
    this._restrictBottom(rect, restrictionsRect);
  }

  private _restrictLeft(rect: IRect, restrictions: IRect): void {
    const delta = rect.x - (restrictions.x - CHILD_RESIZE_OFFSET);
    if (delta > 0) {
      rect.x -= delta;
      rect.width += delta;
    }
  }

  private _restrictTop(rect: IRect, restrictions: IRect): void {
    const delta = rect.y - (restrictions.y - CHILD_RESIZE_OFFSET);
    if (delta > 0) {
      rect.y -= delta;
      rect.height += delta;
    }
  }

  private _restrictRight(rect: IRect, restrictions: IRect): void {
    const maxRight = restrictions.x + restrictions.width + CHILD_RESIZE_OFFSET;
    if (rect.x + rect.width <= maxRight) {
      rect.width = maxRight - rect.x;
    }
  }

  private _restrictBottom(rect: IRect, restrictions: IRect): void {
    const maxBottom = restrictions.y + restrictions.height + CHILD_RESIZE_OFFSET;
    if (rect.y + rect.height <= maxBottom) {
      rect.height = maxBottom - rect.y;
    }
  }
}
