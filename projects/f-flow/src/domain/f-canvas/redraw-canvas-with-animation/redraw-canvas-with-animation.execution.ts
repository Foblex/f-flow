import { inject, Injectable } from '@angular/core';
import { RedrawCanvasWithAnimationRequest } from './redraw-canvas-with-animation-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { transitionEnd } from '../../transition-end';

/**
 * Execution that redraws the canvas with or without animation based on the request.
 * If animated, it will redraw with animation and wait for the transition end to notify data change.
 * If not animated, it will redraw immediately and notify data change.
 */
@Injectable()
@FExecutionRegister(RedrawCanvasWithAnimationRequest)
export class RedrawCanvasWithAnimationExecution implements IExecution<RedrawCanvasWithAnimationRequest, void> {

  private readonly _store = inject(FComponentsStore);

  private get _fCanvasElement(): HTMLElement {
    return this._store.fCanvas!.hostElement;
  }

  public handle(request: RedrawCanvasWithAnimationRequest): void {
    request.animated ? this._redrawWithAnimation() : this._redraw();
    this._store.fCanvas!.emitCanvasChangeEvent();
  }

  private _redrawWithAnimation(): void {
    this._store.fCanvas!.redrawWithAnimation();
    transitionEnd(this._fCanvasElement, () => this._store.dataChanged());
  }

  private _redraw(): void {
    this._store.fCanvas!.redraw();
    this._store.dataChanged();
  }
}
