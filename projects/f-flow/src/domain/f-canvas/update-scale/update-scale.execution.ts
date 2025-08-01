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
export class UpdateScaleExecution implements IExecution<UpdateScaleRequest, void> {

  private readonly _store = inject(FComponentsStore);

  private get transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  public handle(request: UpdateScaleRequest): void {
    if (request.scale !== this.transform.scale) {

      const summaryPosition = PointExtensions.sum(this.transform.scaledPosition, this.transform.position);

      const newX = request.toPosition.x - (request.toPosition.x - summaryPosition.x) * request.scale / this.transform.scale;
      const newY = request.toPosition.y - (request.toPosition.y - summaryPosition.y) * request.scale / this.transform.scale;

      this.transform.scale = request.scale;
      this.transform.scaledPosition = PointExtensions.sub(PointExtensions.initialize(newX, newY), this.transform.position);
    }
  }
}
