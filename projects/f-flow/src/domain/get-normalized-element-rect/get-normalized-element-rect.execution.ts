import { inject, Injectable } from '@angular/core';
import { GetNormalizedElementRectRequest } from './get-normalized-element-rect-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import {
  IRoundedRect,
  RoundedRect,
  IPoint,
  ISize,
  SizeExtensions,
  ITransformModel,
  RectExtensions, IRect
} from '@foblex/2d';
import {GetNormalizedPointRequest} from "../get-normalized-point";

@Injectable()
@FExecutionRegister(GetNormalizedElementRectRequest)
export class GetNormalizedElementRectExecution implements IExecution<GetNormalizedElementRectRequest, IRect> {

  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fMediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: GetNormalizedElementRectRequest): IRect {
    const systemRect = this._getElementRoundedRect(request);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect)

    const offsetSize = this._getOffsetSize(request.element, unscaledSize);
    return RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
  }

  // BrowserWindow
  // +--------------------------------+
  // |                                |
  // |     Element                    |
  // |     (x: 100, y: 50)            |
  // |     +--------+                 |
  // |     |        |                 |
  // |     |        |                 |
  // |     +--------+                 |
  // |                                |
  // +--------------------------------+
  // This data of the element is relative to the browser window, not the canvas, with all transformations applied.
  private _getElementRoundedRect(request: GetNormalizedElementRectRequest): IRoundedRect {
    return RoundedRect.fromRect(RectExtensions.fromElement(request.element));
  }

  private _normalizePosition(rect: IRoundedRect): IPoint {
    return this._fMediator.execute(new GetNormalizedPointRequest(rect));
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
