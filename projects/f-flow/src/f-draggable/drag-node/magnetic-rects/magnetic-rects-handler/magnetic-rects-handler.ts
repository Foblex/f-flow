import { IRect, ITransformModel } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FComponentsStore, INSTANCES } from '../../../../f-storage';
import { calculateMagneticRects, IMagneticRectsResult, MagneticRectsRenderer } from '../domain';

export class MagneticRectsHandler {
  private _timerId: ReturnType<typeof setTimeout> | null = null;

  private readonly _canvasTransform: ITransformModel;
  private readonly _alignThreshold: number = 10;
  private readonly _spacingThreshold: number = 10;

  constructor(
    injector: Injector,
    private readonly _renderer: MagneticRectsRenderer,
    private readonly _rects: IRect[],
  ) {
    const store = injector.get(FComponentsStore);

    const magneticRects = store.instances.require(INSTANCES.MAGNETIC_RECTS);

    this._alignThreshold = magneticRects.alignThreshold();
    this._spacingThreshold = magneticRects.spacingThreshold();
    this._canvasTransform = store.transform;
  }

  public scheduleRender(_draggedRect: IRect): void {
    if (this._timerId) {
      clearTimeout(this._timerId);
    }

    this._timerId = setTimeout(() => this._renderRects(this._computeRects(_draggedRect)), 15);
  }

  private _renderRects(result: IMagneticRectsResult): void {
    if (result.axis !== undefined && result.delta !== undefined && result.rects.length > 0) {
      this._renderer.draw(result.rects, this._canvasTransform);

      return;
    }

    this._renderer.hideAll();
  }

  public _computeRects(_draggedRect: IRect): IMagneticRectsResult {
    return calculateMagneticRects(
      this._rects,
      _draggedRect,
      this._alignThreshold,
      this._spacingThreshold,
    );
  }

  public clearGuides(): void {
    this._renderer.hideAll();

    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
}
