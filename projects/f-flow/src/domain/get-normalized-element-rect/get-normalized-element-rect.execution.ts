import { inject, Injectable } from '@angular/core';
import { GetNormalizedElementRectRequest } from './get-normalized-element-rect-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import {
  IRoundedRect,
  RoundedRect,
  IPoint,
  ISize,
  Point,
  SizeExtensions,
  ITransformModel,
  RectExtensions
} from '@foblex/2d';
import { GetElementRoundedRectRequest } from '../get-element-rounded-rect';

@Injectable()
@FExecutionRegister(GetNormalizedElementRectRequest)
export class GetNormalizedElementRectExecution implements IExecution<GetNormalizedElementRectRequest, IRoundedRect> {

  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fMediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: GetNormalizedElementRectRequest): IRoundedRect {
    const systemRect = this._getElementRoundedRect(request);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect)

    const offsetSize = this._getOffsetSize(request.element, unscaledSize);
    return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  }

  private _getElementRoundedRect(request: GetNormalizedElementRectRequest): IRoundedRect {
    return request.isRoundedRect ? this._fMediator.execute<IRoundedRect>(
      new GetElementRoundedRectRequest(request.element)
    ) : RoundedRect.fromRect(RectExtensions.fromElement(request.element));
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return Point.fromPoint(rect).elementTransform(this._fComponentsStore.flowHost).sub(this._transform.scaledPosition).sub(this._transform.position).div(this._transform.scale);
  }

  private _unscaleSize(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }

  private _getUnscaledRect(position: IPoint, size: ISize, rect: IRoundedRect): IRoundedRect {
    return new RoundedRect(
      position.x, position.y, size.width, size.height,
      rect.radius1, rect.radius2, rect.radius3, rect.radius4
    )
  }

  private _getOffsetSize(element: HTMLElement | SVGElement, size: ISize): ISize {
    return SizeExtensions.offsetFromElement(element) || size
  }
}
