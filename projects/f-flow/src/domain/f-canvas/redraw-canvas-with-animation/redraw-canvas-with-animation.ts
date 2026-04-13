import { inject, Injectable } from '@angular/core';
import { ECanvasRedrawContext } from './e-canvas-redraw-context';
import { RedrawCanvasWithAnimationRequest } from './redraw-canvas-with-animation-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { transitionEnd } from '../../transition-end';
import { FCanvasBase } from '../../../f-canvas';

/**
 * Execution that redraws the canvas with or without animation based on the request.
 * If animated, it will redraw with animation and wait for the transition end to notify data change.
 * If not animated, it will redraw immediately and notify data change.
 */
@Injectable()
@FExecutionRegister(RedrawCanvasWithAnimationRequest)
export class RedrawCanvasWithAnimation
  implements IExecution<RedrawCanvasWithAnimationRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  public handle(request: RedrawCanvasWithAnimationRequest): void {
    request.animated ? this._redrawWithAnimation(request.context) : this._redraw(request.context);
    this._canvas?.emitCanvasChangeEvent();
  }

  private _redrawWithAnimation(context: ECanvasRedrawContext): void {
    this._store.beginViewportAnimation();
    this._canvas?.redrawWithAnimation();

    transitionEnd(this._canvas.hostElement, () => {
      this._store.endViewportAnimation();

      if (context === ECanvasRedrawContext.WITH_CONNECTION_CHANGES) {
        this._store.emitConnectionChanges();
      }
    });
  }

  private _redraw(context: ECanvasRedrawContext): void {
    this._canvas?.redraw();

    if (context === ECanvasRedrawContext.WITH_CONNECTION_CHANGES) {
      this._store.emitConnectionChanges();
    }
  }
}
