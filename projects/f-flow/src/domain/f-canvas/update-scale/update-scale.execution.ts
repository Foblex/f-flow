import { inject, Injectable } from '@angular/core';
import { UpdateScaleRequest } from './update-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(UpdateScaleRequest)
export class UpdateScaleExecution implements IExecution<UpdateScaleRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
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
