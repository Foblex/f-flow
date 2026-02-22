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
  RoundedRect,
  SizeExtensions,
} from '@foblex/2d';
import { GetElementRoundedRectRequest } from '../get-element-rounded-rect';
import { GetNormalizedPointRequest } from '../get-normalized-point';
import { FGeometryCache } from '../geometry-cache';

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
  private readonly _geometryCache = inject(FGeometryCache);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ element }: GetNormalizedConnectorRectRequest): IRoundedRect {
    const cachedRect = this._getCachedRect(element);
    if (cachedRect) {
      return cachedRect;
    }

    const systemRect = this._getElementRoundedRect(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect);

    const offsetSize = this._getOffsetSize(element, unscaledSize);

    return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  }

  private _getElementRoundedRect(element: HTMLElement | SVGElement): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(new GetElementRoundedRectRequest(element));
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

  private _getCachedRect(element: HTMLElement | SVGElement): IRoundedRect | undefined {
    return (this._getCachedNodeRect(element) ?? this._getCachedConnectorRect(element)) as
      | IRoundedRect
      | undefined;
  }

  private _getCachedNodeRect(element: HTMLElement | SVGElement): IRect | undefined {
    const nodeId = this._geometryCache.resolveNodeIdByElement(element);
    if (nodeId) {
      const nodeRect = this._geometryCache.getNodeRect(nodeId);
      if (nodeRect) {
        return nodeRect;
      }
    }

    return undefined;
  }

  private _getCachedConnectorRect(element: HTMLElement | SVGElement): IRoundedRect | undefined {
    return this._geometryCache.getConnectorRectByElement(element);
  }
}
