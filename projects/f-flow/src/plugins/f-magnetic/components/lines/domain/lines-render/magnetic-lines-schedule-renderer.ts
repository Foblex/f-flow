import { IRect, ISize, ITransformModel } from '@foblex/2d';
import { findClosestMagneticGuides, IMagneticGuidesResult } from '../find-closest-magnetic-guides';
import { MagneticLinesRenderer } from './index';
import { FComponentsStore } from '../../../../../../f-storage';
import { BrowserService } from '@foblex/platform';
import { F_MAGNETIC_LINES, FMagneticLinesBase } from '../f-magnetic-lines-base';

const RENDER_DEBOUNCE_MS = 15;
const DEFAULT_THRESHOLD = 10;

export class MagneticLinesScheduleRenderer {
  private _timerId: ReturnType<typeof setTimeout> | null = null;

  private readonly _transform: ITransformModel;
  private readonly _canvasSize: ISize;
  private readonly _instance: FMagneticLinesBase;
  private readonly _renderer: MagneticLinesRenderer;

  private get _threshold(): number {
    return this._instance.threshold() || DEFAULT_THRESHOLD;
  }

  constructor(store: FComponentsStore, browser: BrowserService) {
    this._transform = store.transform;
    this._canvasSize = store.flowHost.getBoundingClientRect();
    this._instance = store.plugins.get<FMagneticLinesBase>(
      F_MAGNETIC_LINES.toString(),
    ) as FMagneticLinesBase;
    this._renderer = new MagneticLinesRenderer(browser, this._instance.hostElement);
  }

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
