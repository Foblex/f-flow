import { inject, Injectable } from '@angular/core';
import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';
import { FZoomBase } from '../../../f-zoom';
import { F_ZOOM_TAG } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

const PINCH_MOVEMENT_THRESHOLD = 0.5;

@Injectable()
export class PinchToZoomHandler extends DragHandlerBase<unknown> {
  protected readonly type = 'pinch-to-zoom';
  protected readonly kind = 'pinch-to-zoom';

  private readonly _store = inject(FComponentsStore);

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _zoomComponent(): FZoomBase {
    return this._store.fComponents[F_ZOOM_TAG] as FZoomBase;
  }

  private _startDistance: number | null = null;
  private _startScale: number | null = null;
  private _touches!: TouchList;

  public initialize(touches: TouchList): void {
    this._touches = touches;
  }

  public override prepareDragSequence(): void {
    const distance = calculateTouchDistance(this._touches);
    if (distance == null) return;

    this._startDistance = distance;
    this._startScale = this._canvas.transform.scale;
  }

  public override onPointerMove(_: IPoint, event: IPointerEvent): void {
    if (event.touches.length !== 2 || this._startDistance == null || this._startScale == null) {
      return;
    }

    const distance = calculateTouchDistance(event.touches);
    const center = calculateTouchCenter(event.touches);
    if (distance == null || center == null) {
      this._reset();

      return;
    }

    if (Math.abs(distance - this._startDistance) < PINCH_MOVEMENT_THRESHOLD) {
      return;
    }

    event.preventDefault();

    const ratio = distance / this._startDistance;
    const nextScale = this._clamp(this._startScale * ratio);

    this._canvas.setScale(nextScale, this._castPositionToFlow(center));
    this._canvas.redraw();
  }

  private _clamp(value: number): number {
    return Math.max(this._zoomComponent.minimum, Math.min(value, this._zoomComponent.maximum));
  }

  private _castPositionToFlow(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }

  private _reset(): void {
    this._startScale = null;
    this._startDistance = null;
  }

  public override onPointerUp(): void {
    this._reset();
    this._canvas.emitCanvasChangeEvent();
  }
}

function calculateTouchCenter(touches: TouchList): IPoint | null {
  if (touches.length !== 2) {
    return null;
  }

  const a = touches[0];
  const b = touches[1];

  return PointExtensions.initialize((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
}

function calculateTouchDistance(touches: TouchList): number | null {
  if (touches.length !== 2) {
    return null;
  }

  const a = touches[0];
  const b = touches[1];

  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}
