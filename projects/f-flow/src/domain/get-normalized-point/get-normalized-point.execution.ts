import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { GetNormalizedPointRequest } from './get-normalized-point-request';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(GetNormalizedPointRequest)
export class GetNormalizedPointExecution implements IExecution<GetNormalizedPointRequest, IPoint> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: GetNormalizedPointRequest): IPoint {
    return Point.fromPoint(request.position).elementTransform(this._fComponentsStore.flowHost)
      .sub(this._transform.scaledPosition).sub(this._transform.position).div(this._transform.scale);
  }
}
