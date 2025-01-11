import { inject, Injectable } from '@angular/core';
import { GetElementRoundedRectRequest } from './get-element-rounded-rect-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { RoundedRect, RectExtensions, IRect } from '@foblex/2d';

@Injectable()
@FExecutionRegister(GetElementRoundedRectRequest)
export class GetElementRoundedRectExecution implements IExecution<GetElementRoundedRectRequest, RoundedRect> {

  private _fBrowser = inject(BrowserService);

  public handle(request: GetElementRoundedRectRequest): RoundedRect {
    return this._getRoundedRect(
      RectExtensions.fromElement(request.element), request.element, this._getComputedStyle(request.element)
    );
  }

  private _getRoundedRect(rect: IRect, element: HTMLElement | SVGElement, styles: CSSStyleDeclaration): RoundedRect {
    return new RoundedRect(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      this._toPixels(styles.borderTopLeftRadius, element, styles.fontSize),
      this._toPixels(styles.borderTopRightRadius, element, styles.fontSize),
      this._toPixels(styles.borderBottomRightRadius, element, styles.fontSize),
      this._toPixels(styles.borderBottomLeftRadius, element, styles.fontSize)
    );
  }

  private _getComputedStyle(element: HTMLElement | SVGElement): CSSStyleDeclaration {
    return this._fBrowser.window.getComputedStyle(element);
  }

  private _toPixels(value: string, element: HTMLElement | SVGElement, fontSize: string): number {
    return this._fBrowser.toPixels(value, element.clientWidth, element.clientHeight, fontSize) || 0
  }
}
