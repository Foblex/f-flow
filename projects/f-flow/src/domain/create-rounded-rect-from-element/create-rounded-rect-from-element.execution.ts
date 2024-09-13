import { Injectable } from '@angular/core';
import { CreateRoundedRectFromElementRequest } from './create-rounded-rect-from-element-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { RoundedRect, RectExtensions } from '@foblex/2d';

@Injectable()
@FExecutionRegister(CreateRoundedRectFromElementRequest)
export class CreateRoundedRectFromElementExecution implements IExecution<CreateRoundedRectFromElementRequest, RoundedRect> {

  constructor(
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: CreateRoundedRectFromElementRequest): RoundedRect {
    return this.setRadiusFromElement(RoundedRect.fromRect(RectExtensions.fromElement(request.element)), request.element);
  }

  private setRadiusFromElement(rect: RoundedRect, element: HTMLElement | SVGElement): RoundedRect {
    const styles = this.getComputedStyle(element);
    rect.radius1 = this.toPixels(styles.borderTopLeftRadius, element, styles.fontSize);
    rect.radius2 = this.toPixels(styles.borderTopRightRadius, element, styles.fontSize);
    rect.radius3 = this.toPixels(styles.borderBottomRightRadius, element, styles.fontSize);
    rect.radius4 = this.toPixels(styles.borderBottomLeftRadius, element, styles.fontSize);
    return rect;
  }

  private getComputedStyle(element: HTMLElement | SVGElement): CSSStyleDeclaration {
    return this.fBrowser.window.getComputedStyle(element);
  }

  private toPixels(value: string, element: HTMLElement | SVGElement, fontSize: string): number {
    return this.fBrowser.toPixels(value, element.clientWidth, element.clientHeight, fontSize) || 0
  }
}
