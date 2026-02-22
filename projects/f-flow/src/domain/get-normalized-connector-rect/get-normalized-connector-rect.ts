import { inject, Injectable } from '@angular/core';
import { GetNormalizedConnectorRectRequest } from './get-normalized-connector-rect-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import {
  IPoint,
  IRect,
  IRoundedRect,
  ISize,
  ITransformModel,
  RectExtensions,
  RoundedRect,
  SizeExtensions,
} from '@foblex/2d';
import { GetNormalizedPointRequest } from '../get-normalized-point';
import { FGeometryCache } from '../geometry-cache';
import { BrowserService } from '@foblex/platform';

/**
 * Execution that retrieves the normalized rectangle of a connector.
 * It calculates the rectangle based on the element's position and size,
 * adjusting for the canvas transformation and element offsets.
 */
@Injectable()
@FExecutionRegister(GetNormalizedConnectorRectRequest)
export class GetNormalizedConnectorRect implements IExecution<
  GetNormalizedConnectorRectRequest,
  IRoundedRect
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _cache = inject(FGeometryCache);
  private readonly _browser = inject(BrowserService);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ element, cache }: GetNormalizedConnectorRectRequest): IRoundedRect {
    const cachedRect = this._cache.getCachedRect<IRoundedRect>(element);
    if (cachedRect && cache) {
      return cachedRect;
    }

    const systemRect = this._getElementRoundedRect(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect);

    const offsetSize = this._getOffsetSize(element, unscaledSize);

    const rect = RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);

    this._cache.updateRectByElement(element, rect);

    return rect;
  }

  private _getElementRoundedRect(element: HTMLElement | SVGElement): IRoundedRect {
    return this._getRoundedRect(
      RectExtensions.fromElement(element),
      element,
      this._getComputedStyle(element),
    );
  }

  private _getRoundedRect(
    rect: IRect,
    element: HTMLElement | SVGElement,
    styles: CSSStyleDeclaration,
  ): RoundedRect {
    return new RoundedRect(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      this._toPixels(styles.borderTopLeftRadius, element, styles.fontSize),
      this._toPixels(styles.borderTopRightRadius, element, styles.fontSize),
      this._toPixels(styles.borderBottomRightRadius, element, styles.fontSize),
      this._toPixels(styles.borderBottomLeftRadius, element, styles.fontSize),
    );
  }

  private _getComputedStyle(element: HTMLElement | SVGElement): CSSStyleDeclaration {
    return this._browser.window.getComputedStyle(element);
  }

  private _toPixels(value: string, element: HTMLElement | SVGElement, fontSize: string): number {
    return this._browser.toPixels(value, element.clientWidth, element.clientHeight, fontSize) || 0;
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return this._mediator.execute(new GetNormalizedPointRequest(rect));
  }

  private _unscaleSize(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(
      rect.width / this._transform.scale,
      rect.height / this._transform.scale,
    );
  }

  private _getUnscaledRect(position: IPoint, size: ISize, rect: IRoundedRect): IRoundedRect {
    return new RoundedRect(
      position.x,
      position.y,
      size.width,
      size.height,
      rect.radius1,
      rect.radius2,
      rect.radius3,
      rect.radius4,
    );
  }

  private _getOffsetSize(element: HTMLElement | SVGElement, size: ISize): ISize {
    return SizeExtensions.offsetFromElement(element) || size;
  }
}
