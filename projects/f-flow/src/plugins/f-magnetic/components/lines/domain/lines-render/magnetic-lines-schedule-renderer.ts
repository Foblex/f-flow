import { IRect, ISize, ITransformModel } from '@foblex/2d';
import { findClosestMagneticGuides, IMagneticGuidesResult } from '../find-closest-magnetic-guides';
import { MagneticLinesRenderer } from './index';

const RENDER_DEBOUNCE_MS = 15;
const DEFAULT_THRESHOLD = 10;

export class MagneticLinesScheduleRenderer {
  private _timerId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly _threshold: number = DEFAULT_THRESHOLD,
    private readonly _transform: ITransformModel,
    private readonly _renderer: MagneticLinesRenderer,
    private readonly _canvasSize: ISize,
    private readonly _rects: IRect[],
  ) {}

  public scheduleRender(draggedRect: IRect): void {
    if (this._timerId) {
      clearTimeout(this._timerId);
    }

    this._timerId = setTimeout(() => this._render(draggedRect), RENDER_DEBOUNCE_MS);
  }

  public clear(): void {
    this._renderer.hideAll();

    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }

  private _render(draggedRect: IRect): void {
    const guides = this._computeGuides(draggedRect);

    this._renderVertical(guides);
    this._renderHorizontal(guides);
  }

  private _renderVertical(guides: IMagneticGuidesResult): void {
    const x = guides.x.guide;
    if (x !== undefined) {
      this._renderer.renderVertical(x, this._canvasSize, this._transform);
    } else {
      this._renderer.hideVertical();
    }
  }

  private _renderHorizontal(guides: IMagneticGuidesResult): void {
    const y = guides.y.guide;
    if (y !== undefined) {
      this._renderer.renderHorizontal(y, this._canvasSize, this._transform);
    } else {
      this._renderer.hideHorizontal();
    }
  }

  private _computeGuides(draggedRect: IRect): IMagneticGuidesResult {
    return findClosestMagneticGuides(this._rects, draggedRect, this._threshold);
  }
}
