import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ResetZoomRequest } from './reset-zoom-request';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';

@Injectable()
@FExecutionRegister(ResetZoomRequest)
export class ResetZoomExecution implements IExecution<ResetZoomRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _fCanvas(): FCanvasBase {
    return this._fComponentsStore.fCanvas!;
  }

  public handle(request: ResetZoomRequest): void {
    this._fCanvas.resetScale();
    this._fCanvas.redraw();
    this._fCanvas.emitCanvasChangeEvent();
  }
}
