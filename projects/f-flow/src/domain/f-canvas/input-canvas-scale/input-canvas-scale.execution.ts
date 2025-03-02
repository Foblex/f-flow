import { inject, Injectable } from '@angular/core';
import { InputCanvasScaleRequest } from './input-canvas-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(InputCanvasScaleRequest)
export class InputCanvasScaleExecution implements IExecution<InputCanvasScaleRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: InputCanvasScaleRequest): void {
    console.log('InputCanvasScaleExecution', request);
    if (!request.scale && request.scale !== 0) {
      return;
    }
    request.transform.scale = request.scale;
    console.log('InputCanvasScaleExecution', request.scale);
    this._fComponentsStore.fCanvas?.redraw();
  }
}
