import { Injectable } from '@angular/core';
import { ResetScaleRequest } from './reset-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';


@Injectable()
@FExecutionRegister(ResetScaleRequest)
export class ResetScaleExecution implements IExecution<ResetScaleRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: ResetScaleRequest): void {
    this.transform.scale = 1;
    this.transform.scaledPosition = PointExtensions.initialize();
  }
}
