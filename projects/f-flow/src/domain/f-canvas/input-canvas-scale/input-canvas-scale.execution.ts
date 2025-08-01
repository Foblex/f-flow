import { inject, Injectable } from '@angular/core';
import { InputCanvasScaleRequest } from './input-canvas-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
/**
 * Execution that handles the scaling of the input canvas.
 * It updates the scale of the canvas transform and redraws the canvas when the user sets a new scale using the input.
 */
@Injectable()
@FExecutionRegister(InputCanvasScaleRequest)
export class InputCanvasScaleExecution implements IExecution<InputCanvasScaleRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: InputCanvasScaleRequest): void {
    if (!request.scale && request.scale !== 0) {
      return;
    }
    request.transform.scale = request.scale;
    this._store.fCanvas?.redraw();
  }
}
