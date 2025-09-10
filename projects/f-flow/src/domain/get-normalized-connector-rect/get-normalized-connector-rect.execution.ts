import { inject, Injectable } from '@angular/core';
import { GetNormalizedConnectorRectRequest } from './get-normalized-connector-rect-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import {
  IRoundedRect,
  RoundedRect,
  IPoint,
  ISize,
  SizeExtensions,
  ITransformModel,
} from '@foblex/2d';
import { GetElementRoundedRectRequest } from '../get-element-rounded-rect';
import { GetNormalizedPointRequest } from "../get-normalized-point";

/**
 * Execution that retrieves the normalized rectangle of a connector.
 * It calculates the rectangle based on the element's position and size,
 * adjusting for the canvas transformation and element offsets.
 */
@Injectable()
@FExecutionRegister(GetNormalizedConnectorRectRequest)
export class GetNormalizedConnectorRectExecution implements IExecution<GetNormalizedConnectorRectRequest, IRoundedRect> {

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  public handle(request: GetNormalizedConnectorRectRequest): IRoundedRect {
    const systemRect = this._getElementRoundedRect(request);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect)

    const offsetSize = this._getOffsetSize(request.element, unscaledSize);

    return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  }

  private _getElementRoundedRect(request: GetNormalizedConnectorRectRequest): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new GetElementRoundedRectRequest(request.element),
    );
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return this._mediator.execute(new GetNormalizedPointRequest(rect));
  }

  private _unscaleSize(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }

  private _getUnscaledRect(position: IPoint, size: ISize, rect: IRoundedRect): IRoundedRect {
    return new RoundedRect(
      position.x, position.y, size.width, size.height,
      rect.radius1, rect.radius2, rect.radius3, rect.radius4,
    )
  }

  private _getOffsetSize(element: HTMLElement | SVGElement, size: ISize): ISize {
    return SizeExtensions.offsetFromElement(element) || size
  }
}
