import { IRect, ITransformModel, Point, RectExtensions, SizeExtensions } from '@foblex/core';
import { Injectable } from '@angular/core';
import { GetElementRectInFlowRequest } from './get-element-rect-in-flow-request';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FComponentsStore } from '../../f-storage';

@Injectable()
@FExecutionRegister(GetElementRectInFlowRequest)
export class GetElementRectInFlowExecution implements IExecution<GetElementRectInFlowRequest, IRect> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.flowHost;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetElementRectInFlowRequest): IRect {

    const systemRect = RectExtensions.fromElement(request.element);

    const position = Point.fromPoint(systemRect).elementTransform(this.flowHost).sub(this.transform.scaledPosition).sub(this.transform.position).div(this.transform.scale);

    const size = SizeExtensions.initialize(systemRect.width / this.transform.scale, systemRect.height / this.transform.scale);

    return RectExtensions.initialize(position.x, position.y, size.width, size.height);
  }
}
