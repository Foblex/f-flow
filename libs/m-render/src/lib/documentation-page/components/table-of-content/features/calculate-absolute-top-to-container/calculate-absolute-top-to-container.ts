import { CalculateAbsoluteTopToContainerRequest } from './calculate-absolute-top-to-container-request';
import { inject, Injectable } from '@angular/core';
import { SCROLLABLE_CONTAINER } from '../../../index';
import { IExecution, MExecution } from '../../../../../mediatr';

@Injectable()
@MExecution(CalculateAbsoluteTopToContainerRequest)
export class CalculateAbsoluteTopToContainer
  implements IExecution<CalculateAbsoluteTopToContainerRequest, number> {

  private readonly _scrollableContainer = inject(SCROLLABLE_CONTAINER);

  public handle(request: CalculateAbsoluteTopToContainerRequest): number {
    let element = request.element;
    let result = 0;

    while (element !== this._scrollableContainer.htmlElement) {
      if (!element) return NaN;
      result += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }

    return result;
  }
}
