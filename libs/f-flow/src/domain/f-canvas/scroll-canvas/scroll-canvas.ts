import { inject, Injectable } from '@angular/core';
import { ScrollCanvasRequest } from './scroll-canvas-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

/**
 * Moves the canvas by the given screen-space delta and redraws it. Used by scroll-to-pan
 * (see the control-scheme `scrollPan` gesture), mirroring how a canvas drag updates the
 * transform position.
 */
@Injectable()
@FExecutionRegister(ScrollCanvasRequest)
export class ScrollCanvas implements IExecution<ScrollCanvasRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ delta }: ScrollCanvasRequest): void {
    const canvas = this._store.fCanvas;
    if (!canvas || (delta.x === 0 && delta.y === 0)) {
      return;
    }

    const position = this._store.transform.position;
    canvas._setPosition(PointExtensions.initialize(position.x - delta.x, position.y - delta.y));
    canvas.redraw();
    canvas.emitCanvasChangeEvent();
  }
}
