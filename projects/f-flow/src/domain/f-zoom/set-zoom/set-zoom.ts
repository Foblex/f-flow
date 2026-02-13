import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SetZoomRequest } from './set-zoom-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
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
export class SetZoom implements IExecution<SetZoomRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _zoomComponent(): FZoomBase | undefined {
    return this._store.instances.get(INSTANCES.ZOOM);
  }

  private get _isDragStarted(): boolean {
    return this._mediator.execute<boolean>(new IsDragStartedRequest());
  }

  public handle(request: SetZoomRequest): void {
    if (this._isDragStarted || !this._zoomComponent) {
      return;
    }

    const result = this._canvas.transform.scale + request.step * request.direction;

    this._canvas.setScale(this._clamp(result), this._castPositionToFlow(request.position));
    request.animate ? this._canvas.redrawWithAnimation() : this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
  }

  private _clamp(value: number): number {
    return Math.max(this._zoomComponent?.minimum || 1, Math.min(value, this._zoomComponent?.maximum || 1));
  }

  private _castPositionToFlow(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }
}
