import { Injectable } from '@angular/core';
import { ApplyChildResizeRestrictionsRequest } from './apply-child-resize-restrictions.request';
import { IRect } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';

const OFFSET = 0;

@Injectable()
@FExecutionRegister(ApplyChildResizeRestrictionsRequest)
export class ApplyChildResizeRestrictionsExecution
  implements IExecution<ApplyChildResizeRestrictionsRequest, void> {

  public handle(request: ApplyChildResizeRestrictionsRequest): void {
    this.applyRestrictions(request.rect, request.restrictionsRect);
  }

  private applyRestrictions(rect: IRect, restrictionsRect: IRect): void {
    this.left(rect, restrictionsRect);
    this.top(rect, restrictionsRect);
    this.right(rect, restrictionsRect);
    this.bottom(rect, restrictionsRect);
  }

  private left(rect: IRect, restrictionsRect: IRect): void {
    if (rect.x > restrictionsRect.x - OFFSET) {
      rect.width += rect.x - restrictionsRect.x - OFFSET;
      rect.x = restrictionsRect.x - OFFSET;
    }
  }

  private top(rect: IRect, restrictionsRect: IRect): void {
    if (rect.y > restrictionsRect.y - OFFSET) {
      rect.height += rect.y - restrictionsRect.y - OFFSET;
      rect.y = restrictionsRect.y - OFFSET;
    }
  }

  private right(rect: IRect, restrictionsRect: IRect): void {
    if (rect.x + rect.width <= restrictionsRect.x + restrictionsRect.width + OFFSET) {
      rect.width = restrictionsRect.x + restrictionsRect.width - rect.x + OFFSET;
    }
  }

  private bottom(rect: IRect, restrictionsRect: IRect): void {
    if (rect.y + rect.height <= restrictionsRect.y + restrictionsRect.height + OFFSET) {
      rect.height = restrictionsRect.y + restrictionsRect.height - rect.y + OFFSET;
    }
  }
}
