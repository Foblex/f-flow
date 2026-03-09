import { inject, Injectable } from '@angular/core';
import { GetNormalizedElementRectRequest } from './get-normalized-element-rect-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import {
  IPoint,
  IRect,
  ISize,
  ITransformModel,
  RectExtensions,
  RoundedRect,
  SizeExtensions,
} from '@foblex/2d';
import { GetCachedFCacheRectRequest, UpdateFCacheRectByElementRequest } from '../../f-cache';
import { calculatePointerInFlow } from '../../utils';

/**
 * Execution that retrieves the normalized rectangle of an element.
 * It calculates the rectangle based on the element's position and size,
 * adjusting for the canvas transformation and element offsets.
 */
@Injectable()
@FExecutionRegister(GetNormalizedElementRectRequest)
export class GetNormalizedElementRect implements IExecution<
  GetNormalizedElementRectRequest,
  IRect
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ element }: GetNormalizedElementRectRequest): IRect {
    const cachedRect = this._mediator.execute<IRect | undefined>(
      new GetCachedFCacheRectRequest(element),
    );
    if (cachedRect) {
      return cachedRect;
    }

    const systemRect = RectExtensions.fromElement(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize);

    const offsetSize = this._getOffsetSize(element, unscaledSize);

    const rect = this._fromCenter(unscaledRect, offsetSize.width, offsetSize.height);

    this._mediator.execute(new UpdateFCacheRectByElementRequest(element, rect));

    return rect;
  }

  private _fromCenter(rect: IRect, width: number, height: number): IRect {
    return RectExtensions.initialize(
      rect.gravityCenter.x - width / 2,
      rect.gravityCenter.y - height / 2,
      width,
      height,
    );
  }

  private _normalizePosition(rect: IRect): IPoint {
    return calculatePointerInFlow(rect, this._store.flowHost, this._transform);
  }

  private _unscaleSize(rect: IRect): ISize {
    return SizeExtensions.initialize(
      rect.width / this._transform.scale,
      rect.height / this._transform.scale,
    );
  }

  private _getUnscaledRect(position: IPoint, size: ISize): IRect {
    return new RoundedRect(position.x, position.y, size.width, size.height);
  }

  private _getOffsetSize(element: HTMLElement | SVGElement, size: ISize): ISize {
    return SizeExtensions.offsetFromElement(element) || size;
  }
}
