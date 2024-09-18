import { Injectable } from '@angular/core';
import { InputCanvasPositionRequest } from './input-canvas-position-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ITransformModel, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(InputCanvasPositionRequest)
export class InputCanvasPositionExecution implements IExecution<InputCanvasPositionRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: InputCanvasPositionRequest): void {
    if (!request.position) {
      return;
    }
    const position = PointExtensions.sum(this.transform.position, this.transform.scaledPosition);
    if (!PointExtensions.isEqual(position, request.position)) {
      this.transform.position = request.position;
      this.transform.scaledPosition = PointExtensions.initialize();
      this.fComponentsStore.fCanvas!.redraw();
    }
  }
}
