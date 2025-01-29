import { findClosestAlignment, IMinMaxPoint, IPoint, IRect, ISize, ITransformModel, RectExtensions } from '@foblex/2d';
import { fInject, IDraggableItem, PointBoundsLimiter } from '../index';
import { FComponentsStore } from '../../f-storage';
import { ILineAlignmentResult, LineService } from '../../f-line-alignment';

export class LineAlignmentDragHandler implements IDraggableItem {

  private _fComponentsStore = fInject(FComponentsStore);

  private _debounceTimer: any = null;

  private readonly _transform: ITransformModel;

  constructor(
    private _lineService: LineService,
    private _size: ISize,
    private _draggedNodeRect: IRect,
    private _rects: IRect[],
    private _restrictions: IMinMaxPoint,
  ) {
    this._transform = this._fComponentsStore.fCanvas?.transform!;
  }

  public onPointerMove(difference: IPoint): void {
    const restrictedDifference = this._getDifference(difference);
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => this._drawIntersectingLines(restrictedDifference), 15);
  }

  private _drawIntersectingLines(difference: IPoint): void {
    const intersect = this.findNearestCoordinate(difference);
    if (intersect.xResult.value !== undefined) {
      this._lineService.drawVerticalLine(intersect.xResult.value, this._size, this._transform);
    } else {
      this._lineService.hideVerticalLine();
    }
    if (intersect.yResult.value !== undefined) {
      this._lineService.drawHorizontalLine(intersect.yResult.value, this._size, this._transform);
    } else {
      this._lineService.hideHorizontalLine();
    }
  }

  private _getDifference(difference: IPoint): IPoint {
    return {
      x: Math.min(Math.max(difference.x, this._restrictions.min.x), this._restrictions.max.x),
      y: Math.min(Math.max(difference.y, this._restrictions.min.y), this._restrictions.max.y)
    }
  }

  public findNearestCoordinate(difference: IPoint): ILineAlignmentResult {
    const rect = RectExtensions.addPoint(this._draggedNodeRect, difference);
    return findClosestAlignment(this._rects, rect, this._fComponentsStore.fLineAlignment!.fAlignThreshold);
  }

  public onPointerUp(): void {
    this._lineService.hideVerticalLine();
    this._lineService.hideHorizontalLine();

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }
}
