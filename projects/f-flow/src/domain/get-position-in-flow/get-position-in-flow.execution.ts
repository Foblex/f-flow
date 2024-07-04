import { IHandler, IPoint, ITransformModel, Point } from '@foblex/core';
import { Injectable } from '@angular/core';
import { GetPositionInFlowRequest } from './get-position-in-flow-request';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(GetPositionInFlowRequest)
export class GetPositionInFlowExecution implements IExecution<GetPositionInFlowRequest, IPoint> {

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

  public handle(request: GetPositionInFlowRequest): IPoint {
    return Point.fromPoint(request.position).elementTransform(this.flowHost)
      .sub(this.transform.scaledPosition).sub(this.transform.position).div(this.transform.scale);
  }
}
