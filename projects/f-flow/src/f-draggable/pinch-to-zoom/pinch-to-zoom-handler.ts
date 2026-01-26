import { Injector } from '@angular/core';
import { IPoint, Point } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { calculateTouchCenter, calculateTouchDistance } from './utils';
import { IPointerEvent } from '../../drag-toolkit';
import { PINCH_MOVEMENT_THRESHOLD } from './constants';
import { FZoomBase } from '../../f-zoom';
import { F_ZOOM_TAG } from '../../domain';
import { FComponentsStore } from '../../f-storage';
import { FCanvasBase } from '../../f-canvas';

export class PinchToZoomHandler implements IFDragHandler {
  private readonly _store: FComponentsStore;

  public readonly fEventType = 'pinch-to-zoom';

  private get _flowHost(): HTMLElement {
    return this._store.fFlow?.hostElement as HTMLElement;
  }

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _zoomComponent(): FZoomBase {
    return this._store.fComponents[F_ZOOM_TAG] as FZoomBase;
  }

  private _pinchStartDistance: number | null = null;
  private _pinchStartScale: number | null = null;

  constructor(
    _injector: Injector,
    private _touches: TouchList,
  ) {
    this._store = _injector.get(FComponentsStore);
  }

  public prepareDragSequence(): void {
    const d = calculateTouchDistance(this._touches);
    if (d == null) return;

    this._pinchStartDistance = d;
    this._pinchStartScale = this._canvas.transform.scale;
  }

  public onPointerMove(_: IPoint, event: IPointerEvent): void {
    if (
      event.touches.length !== 2 ||
      this._pinchStartDistance == null ||
      this._pinchStartScale == null
    ) {
      return;
    }

    const d = calculateTouchDistance(event.touches);
    const center = calculateTouchCenter(event.touches);
    if (d == null || center == null) {
      this._resetPinch();

      return;
    }

    if (Math.abs(d - this._pinchStartDistance) < PINCH_MOVEMENT_THRESHOLD) {
      return;
    }

    event.preventDefault();

    const ratio = d / this._pinchStartDistance;
    const nextScale = this._clamp(this._pinchStartScale * ratio);

    this._canvas.setScale(nextScale, this._castPositionToFlow(center));
    this._canvas.redraw();
  }

  private _clamp(value: number): number {
    return Math.max(this._zoomComponent.minimum, Math.min(value, this._zoomComponent.maximum));
  }

  private _castPositionToFlow(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }

  private _resetPinch(): void {
    this._pinchStartScale = null;
    this._pinchStartDistance = null;
  }

  public onPointerUp(): void {
    this._resetPinch();
    this._canvas.emitCanvasChangeEvent();
  }
}
