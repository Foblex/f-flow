import { Injectable } from '@angular/core';
import { ApplyParentResizeRestrictionsRequest } from './apply-parent-resize-restrictions.request';
import { IRect } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';

const OFFSET = 0;

@Injectable()
@FExecutionRegister(ApplyParentResizeRestrictionsRequest)
export class ApplyParentResizeRestrictionsExecution
  implements IExecution<ApplyParentResizeRestrictionsRequest, void> {

  public handle(request: ApplyParentResizeRestrictionsRequest): void {
    this.applyRestrictions(request.rect, request.restrictionsRect);
  }

  private applyRestrictions(rect: IRect, restrictionsRect: IRect): void {
    this.left(rect, restrictionsRect);
    this.top(rect, restrictionsRect);
    this.right(rect, restrictionsRect);
    this.bottom(rect, restrictionsRect);
  }

  private left(rect: IRect, restrictionsRect: IRect): void {
    if (rect.x <= restrictionsRect.x + OFFSET) {
      rect.width -= restrictionsRect.x - rect.x + OFFSET;
      rect.x = restrictionsRect.x + OFFSET;
    }
  }

  private top(rect: IRect, restrictionsRect: IRect): void {
    if (rect.y <= restrictionsRect.y + OFFSET) {
      rect.height -= restrictionsRect.y - rect.y + OFFSET;
      rect.y = restrictionsRect.y + OFFSET;
    }
  }

  private right(rect: IRect, restrictionsRect: IRect): void {
    if (rect.x + rect.width > restrictionsRect.x + restrictionsRect.width - OFFSET) {
      rect.width = restrictionsRect.x + restrictionsRect.width - rect.x - OFFSET;
    }
  }

  private bottom(rect: IRect, restrictionsRect: IRect): void {
    if (rect.y + rect.height > restrictionsRect.y + restrictionsRect.height - OFFSET) {
      rect.height = restrictionsRect.y + restrictionsRect.height - rect.y - OFFSET;
    }
  }
}
