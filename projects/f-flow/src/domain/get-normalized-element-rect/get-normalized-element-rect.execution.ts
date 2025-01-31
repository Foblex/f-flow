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

  private _fComponentsStore = inject(FComponentsStore);
  private _fMediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: GetNormalizedElementRectRequest): IRoundedRect {
    const systemRect = this._getElementRoundedRect(request);
    const position = this._normalizePosition(systemRect);
    const size = this._normalizeSize(systemRect);

    return new RoundedRect(
      position.x, position.y, size.width, size.height,
      systemRect.radius1, systemRect.radius2, systemRect.radius3, systemRect.radius4
    );
  }

  private _getElementRoundedRect(request: GetNormalizedElementRectRequest): IRoundedRect {
    return request.isRoundedRect ? this._fMediator.execute<IRoundedRect>(
      new GetElementRoundedRectRequest(request.element)
    ) : RoundedRect.fromRect(RectExtensions.fromElement(request.element));
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return Point.fromPoint(rect).elementTransform(this._fComponentsStore.flowHost).sub(this._transform.scaledPosition).sub(this._transform.position).div(this._transform.scale);
  }

  private _normalizeSize(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }
}
