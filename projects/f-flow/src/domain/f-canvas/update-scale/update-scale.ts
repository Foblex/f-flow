import { inject, Injectable } from '@angular/core';
import { UpdateScaleRequest } from './update-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that updates the scale of the canvas in the FComponentsStore.
 * Occurs when the fZoom directive or User call the setScale method.
 */
@Injectable()
@FExecutionRegister(UpdateScaleRequest)
export class UpdateScale implements IExecution<UpdateScaleRequest, void> {
  private readonly _store = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ scale, toPosition }: UpdateScaleRequest): void {
    if (scale === this._transform.scale) {
      return;
    }
    const summaryPosition = PointExtensions.sum(
      this._transform.scaledPosition,
      this._transform.position,
    );

    const newX =
      toPosition.x - ((toPosition.x - summaryPosition.x) * scale) / this._transform.scale;
    const newY =
      toPosition.y - ((toPosition.y - summaryPosition.y) * scale) / this._transform.scale;

    this._transform.scale = scale;
    this._transform.scaledPosition = PointExtensions.sub(
      PointExtensions.initialize(newX, newY),
      this._transform.position,
    );
  }
}
