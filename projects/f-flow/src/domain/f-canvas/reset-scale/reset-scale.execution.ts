import { inject, Injectable } from '@angular/core';
import { ResetScaleRequest } from './reset-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(ResetScaleRequest)
export class ResetScaleExecution implements IExecution<ResetScaleRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: ResetScaleRequest): void {
    this.transform.scale = 1;
    this.transform.scaledPosition = PointExtensions.initialize();
  }
}
