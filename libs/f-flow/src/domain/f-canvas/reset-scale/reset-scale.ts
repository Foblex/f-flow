import { inject, Injectable } from '@angular/core';
import { ResetScaleRequest } from './reset-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that resets the scale of the canvas in the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(ResetScaleRequest)
export class ResetScale implements IExecution<ResetScaleRequest, void> {
  private readonly _store = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle(_: ResetScaleRequest): void {
    this._transform.scale = 1;
    this._transform.scaledPosition = PointExtensions.initialize();
  }
}
