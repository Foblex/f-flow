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

  private readonly _fComponentsStore = inject(FComponentsStore);

  private get _fCanvasElement(): HTMLElement {
    return this._fComponentsStore.fCanvas!.hostElement;
  }

  public handle(request: RedrawCanvasWithAnimationRequest): void {
    request.animated ? this._redrawWithAnimation() : this._redraw();
    this._fComponentsStore.fCanvas!.emitCanvasChangeEvent();
  }

  private _redrawWithAnimation(): void {
    this._fComponentsStore.fCanvas!.redrawWithAnimation();
    transitionEnd(this._fCanvasElement, () => this._fComponentsStore.dataChanged());
  }

  private _redraw(): void {
    this._fComponentsStore.fCanvas!.redraw();
    this._fComponentsStore.dataChanged();
  }
}
