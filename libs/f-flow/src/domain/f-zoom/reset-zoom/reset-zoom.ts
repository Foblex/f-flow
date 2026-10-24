import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { ResetZoomRequest } from './reset-zoom-request';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';

/**
 * Execution that resets the zoom level of the FCanvas.
 */
@Injectable()
export class ResetZoom implements IExecution<ResetZoomRequest, void> {
  private readonly _store = inject(FComponentsStore);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  public handle(_request: ResetZoomRequest): void {
    this._canvas.resetScale();
    this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
  }
}
