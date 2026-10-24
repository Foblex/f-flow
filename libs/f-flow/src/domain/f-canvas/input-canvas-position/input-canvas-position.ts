import { inject, Injectable } from '@angular/core';
import { InputCanvasPositionRequest } from './input-canvas-position-request';
import { IExecution } from '../../../_libs/f-mediator';
import { IPoint, ITransformModel, PointExtensions } from '../../../_libs/f-2d';
import { FComponentsStore } from '../../../f-storage';

/**
 * It updates the canvas position and redraws the canvas when the user set a new position using the input.
 */
@Injectable()
export class InputCanvasPosition implements IExecution<InputCanvasPositionRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ transform, position }: InputCanvasPositionRequest): void {
    if (!position) {
      return;
    }
    if (!PointExtensions.isEqual(this._calculateTransformPosition(transform), position)) {
      transform.position = position;
      transform.scaledPosition = PointExtensions.initialize();
      this._store.fCanvas?.redraw();
    }
  }

  private _calculateTransformPosition(transform: ITransformModel): IPoint {
    return PointExtensions.sum(transform.position, transform.scaledPosition);
  }
}
