import { inject, Injectable } from '@angular/core';
import { InputCanvasPositionRequest } from './input-canvas-position-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(InputCanvasPositionRequest)
export class InputCanvasPositionExecution implements IExecution<InputCanvasPositionRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: InputCanvasPositionRequest): void {
    if (!request.position) {
      return;
    }
    const position = PointExtensions.sum(request.transform.position, request.transform.scaledPosition);
    if (!PointExtensions.isEqual(position, request.position)) {
      request.transform.position = request.position;
      request.transform.scaledPosition = PointExtensions.initialize();
      this._fComponentsStore.fCanvas?.redraw();
    }
    return void 0;
  }
}
