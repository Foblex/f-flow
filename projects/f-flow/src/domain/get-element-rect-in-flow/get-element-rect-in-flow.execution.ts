import {
  IPoint, ISize,
  ITransformModel,
  Point,
  SizeExtensions
} from '@foblex/core';
import { Injectable } from '@angular/core';
import { GetElementRectInFlowRequest } from './get-element-rect-in-flow-request';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FComponentsStore } from '../../f-storage';
import { IRoundedRect, RoundedRect } from '../intersections';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(GetElementRectInFlowRequest)
export class GetElementRectInFlowExecution implements IExecution<GetElementRectInFlowRequest, IRoundedRect> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.flowHost;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: GetElementRectInFlowRequest): IRoundedRect {
    const systemRect = RoundedRect.fromElement(request.element, this.fBrowser);
    const position = this.transformElementPositionInFlow(systemRect);
    const size = this.transformElementSizeInFlow(systemRect);

    return new RoundedRect(
      position.x, position.y, size.width, size.height,
      systemRect.radius1, systemRect.radius2, systemRect.radius3, systemRect.radius4
    );
  }

  private transformElementPositionInFlow(rect: IRoundedRect): IPoint {
    return Point.fromPoint(rect).elementTransform(this.flowHost).sub(this.transform.scaledPosition).sub(this.transform.position).div(this.transform.scale);
  }

  private transformElementSizeInFlow(rect: IRoundedRect): ISize {
    return SizeExtensions.initialize(rect.width / this.transform.scale, rect.height / this.transform.scale);
  }
}
