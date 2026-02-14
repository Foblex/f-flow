import { IRect, ISize, ITransformModel } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FComponentsStore, INSTANCES } from '../../../../f-storage';
import { calculateMagneticGuides, IMagneticGuidesResult, MagneticLineRenderer } from '../domain';

export class MagneticLinesHandler {
  private _timerId: ReturnType<typeof setTimeout> | null = null;

  private readonly _canvasTransform: ITransformModel;
  private readonly _alignThreshold: number = 10;

  constructor(
    injector: Injector,
    private _renderer: MagneticLineRenderer,
    private _size: ISize,
    private _rects: IRect[],
  ) {
    const store = injector.get(FComponentsStore);
    this._alignThreshold = store.instances.require(INSTANCES.MAGNETIC_LINES).threshold();
    this._canvasTransform = store.transform;
  }

  public scheduleRender(_draggedRect: IRect): void {
    if (this._timerId) {
      clearTimeout(this._timerId);
    }

    this._timerId = setTimeout(() => this._renderGuides(this._computeGuides(_draggedRect)), 15);
  }

  private _renderGuides(guides: IMagneticGuidesResult): void {
    this._renderVertical(guides);
    this._renderHorizontal(guides);
  }

  private _renderVertical(guides: IMagneticGuidesResult): void {
    if (guides.x.guide !== undefined) {
      this._renderer.drawVerticalLine(guides.x.guide, this._size, this._canvasTransform);
    } else {
      this._renderer.hideVertical();
    }
  }

  private _renderHorizontal(guides: IMagneticGuidesResult): void {
    if (guides.y.guide !== undefined) {
      this._renderer.drawHorizontalLine(guides.y.guide, this._size, this._canvasTransform);
    } else {
      this._renderer.hideHorizontal();
    }
  }

  public _computeGuides(_draggedRect: IRect): IMagneticGuidesResult {
    return calculateMagneticGuides(this._rects, _draggedRect, this._alignThreshold);
  }

  public clearGuides(): void {
    this._renderer.hideAll();

    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
}
