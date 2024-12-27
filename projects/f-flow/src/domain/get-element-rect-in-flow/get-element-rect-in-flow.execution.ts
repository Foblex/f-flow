import { inject, Injectable } from '@angular/core';
import { GetElementRectInFlowRequest } from './get-element-rect-in-flow-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../f-storage';
import { IRoundedRect, RoundedRect, IPoint, ISize, Point, SizeExtensions, ITransformModel  } from '@foblex/2d';
import { CreateRoundedRectFromElementRequest } from '../create-rounded-rect-from-element';

@Injectable()
@FExecutionRegister(GetElementRectInFlowRequest)
export class GetElementRectInFlowExecution implements IExecution<GetElementRectInFlowRequest, IRoundedRect> {

  private _fComponentsStore = inject(FComponentsStore);

  private _fMediator = inject(FMediator);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get flowHost(): HTMLElement {
    return this._fComponentsStore.flowHost;
  }

  public handle(request: GetElementRectInFlowRequest): IRoundedRect {
    const systemRect = this._getElementRoundRect(request.element);
    const position = this.transformElementPositionInFlow(systemRect);
    const size = this.transformElementSizeInFlow(systemRect);

    return new RoundedRect(
      position.x, position.y, size.width, size.height,
      systemRect.radius1, systemRect.radius2, systemRect.radius3, systemRect.radius4
    );
  }

  private _getElementRoundRect(element: HTMLElement | SVGElement): IRoundedRect {
    return this._fMediator.send<IRoundedRect>(
      new CreateRoundedRectFromElementRequest(element)
    );
  }

  private transformElementPositionInFlow(rect: IRoundedRect): IPoint {
    return Point.fromPoint(rect).elementTransform(this.flowHost).sub(this._transform.scaledPosition).sub(this._transform.position).div(this._transform.scale);
  }

  private transformElementSizeInFlow(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }
}
