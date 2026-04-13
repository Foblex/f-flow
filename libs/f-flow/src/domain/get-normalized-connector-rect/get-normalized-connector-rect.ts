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
import { GetCachedFCacheRectRequest, UpdateFCacheRectByElementRequest } from '../../f-cache';
import { BrowserService } from '@foblex/platform';
import { calculatePointerInFlow } from '../../utils';

/**
 * Execution that retrieves the normalized rectangle of a connector.
 * It calculates the rectangle based on the element's position and size,
 * adjusting for the canvas transformation and element offsets.
 */
@Injectable()
@FExecutionRegister(GetNormalizedConnectorRectRequest)
export class GetNormalizedConnectorRect
  implements IExecution<GetNormalizedConnectorRectRequest, IRoundedRect>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ element, cache }: GetNormalizedConnectorRectRequest): IRoundedRect {
    const cachedRect = this._mediator.execute<IRoundedRect | undefined>(
      new GetCachedFCacheRectRequest(element),
    );
    if (cachedRect && cache) {
      return cachedRect;
    }

    const systemRect = this._getElementRoundedRect(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect);

    const offsetSize = this._getOffsetSize(element, unscaledSize);

    const rect = RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);

    this._mediator.execute(new UpdateFCacheRectByElementRequest(element, rect));

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
    const [radius1, radius2, radius3, radius4] = this._normalizeCircularBorderRadii(
      rect.width,
      rect.height,
      [
        this._getSystemRadius(styles.borderTopLeftRadius, element, styles.fontSize),
        this._getSystemRadius(styles.borderTopRightRadius, element, styles.fontSize),
        this._getSystemRadius(styles.borderBottomRightRadius, element, styles.fontSize),
        this._getSystemRadius(styles.borderBottomLeftRadius, element, styles.fontSize),
      ],
    );

    return new RoundedRect(
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      radius1,
      radius2,
      radius3,
      radius4,
    );
  }

  private _getComputedStyle(element: HTMLElement | SVGElement): CSSStyleDeclaration {
    return this._browser.window.getComputedStyle(element);
  }

  private _toPixels(value: string, element: HTMLElement | SVGElement, fontSize: string): number {
    return this._browser.toPixels(value, element.clientWidth, element.clientHeight, fontSize) || 0;
  }

  private _getSystemRadius(
    value: string,
    element: HTMLElement | SVGElement,
    fontSize: string,
  ): number {
    return this._toPixels(value, element, fontSize) * this._transform.scale;
  }

  /**
   * Mirrors CSS border-radius normalization so oversized values like `999px`
   * collapse to the largest valid circular radii for the current rect.
   */
  private _normalizeCircularBorderRadii(
    width: number,
    height: number,
    radii: [number, number, number, number],
  ): [number, number, number, number] {
    const [topLeft, topRight, bottomRight, bottomLeft] = radii.map((value) =>
      Math.max(0, value),
    ) as [number, number, number, number];

    const scale = Math.min(
      1,
      this._getRadiusScaleFactor(width, topLeft + topRight),
      this._getRadiusScaleFactor(height, topRight + bottomRight),
      this._getRadiusScaleFactor(width, bottomRight + bottomLeft),
      this._getRadiusScaleFactor(height, bottomLeft + topLeft),
    );

    return [topLeft * scale, topRight * scale, bottomRight * scale, bottomLeft * scale];
  }

  private _getRadiusScaleFactor(limit: number, sum: number): number {
    if (sum <= 0) {
      return 1;
    }

    if (limit <= 0) {
      return 0;
    }

    return limit / sum;
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return calculatePointerInFlow(rect, this._store.flowHost, this._transform);
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
      this._unscaleRadius(rect.radius1),
      this._unscaleRadius(rect.radius2),
      this._unscaleRadius(rect.radius3),
      this._unscaleRadius(rect.radius4),
    );
  }

  private _unscaleRadius(radius: number): number {
    return radius / this._transform.scale;
  }

  private _getOffsetSize(element: HTMLElement | SVGElement, size: ISize): ISize {
    return SizeExtensions.offsetFromElement(element) || size;
  }
}
