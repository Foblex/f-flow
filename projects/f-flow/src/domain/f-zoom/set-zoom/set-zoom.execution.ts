import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SetZoomRequest } from './set-zoom-request';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../f-zoom-tag';
import { IPoint, Point } from '@foblex/2d';
import { FCanvasBase } from '../../../f-canvas';
import { FZoomBase } from '../../../f-zoom';
import { IsDragStartedRequest } from '../../f-draggable';

/**
 * Execution that sets the zoom level of the FCanvas based on the provided request.
 * It adjusts the zoom level by a specified step and direction, ensuring it stays within defined limits.
 */
@Injectable()
@FExecutionRegister(SetZoomRequest)
export class SetZoomExecution implements IExecution<SetZoomRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _fHost(): HTMLElement {
    return this._store.fFlow?.hostElement!;
  }

  private get _fCanvas(): FCanvasBase {
    return this._store.fCanvas!;
  }

  private get _fZoomComponent(): FZoomBase {
    return this._store.fComponents[F_ZOOM_TAG]! as FZoomBase;
  }

  private get _isDragStarted(): boolean {
    return this._mediator.execute<boolean>(new IsDragStartedRequest());
  }

  public handle(request: SetZoomRequest): void {
    if (this._isDragStarted || !this._fZoomComponent) {
      return;
    }

    const result = this._fCanvas.transform.scale + request.step * request.direction;

    this._fCanvas.setScale(this._clamp(result), this._castPositionToFlow(request.position));
    request.animate ? this._fCanvas.redrawWithAnimation() : this._fCanvas.redraw();
    this._fCanvas.emitCanvasChangeEvent();
  }

  private _clamp(value: number): number {
    return Math.max(this._fZoomComponent.minimum, Math.min(value, this._fZoomComponent.maximum));
  }

  private _castPositionToFlow(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this._fHost);
  }
}
