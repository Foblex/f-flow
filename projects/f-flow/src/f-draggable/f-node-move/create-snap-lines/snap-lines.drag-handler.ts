import { findClosestAlignment, IRect, ISize, ITransformModel } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { ISnapResult, SnapLineService } from '../../../f-line-alignment';
import { Injector } from '@angular/core';

export class SnapLinesDragHandler {
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _canvasTransform: ITransformModel;
  private readonly _alignThreshold: number = 10;

  constructor(
    injector: Injector,
    private _lineService: SnapLineService,
    private _size: ISize,
    private _rects: IRect[],
  ) {
    const store = injector.get(FComponentsStore);
    this._alignThreshold = store.fLineAlignment!.fAlignThreshold();
    this._canvasTransform = store.fCanvas?.transform!;
  }

  public drawGuidesFor(_draggedRect: IRect): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => this._renderGuides(_draggedRect), 15);
  }

  private _renderGuides(_draggedRect: IRect): void {
    const intersect = this.findClosestAlignment(_draggedRect);
    if (intersect.xResult.value !== undefined) {
      this._lineService.drawVerticalLine(
        intersect.xResult.value,
        this._size,
        this._canvasTransform,
      );
    } else {
      this._lineService.hideVerticalLine();
    }
    if (intersect.yResult.value !== undefined) {
      this._lineService.drawHorizontalLine(
        intersect.yResult.value,
        this._size,
        this._canvasTransform,
      );
    } else {
      this._lineService.hideHorizontalLine();
    }
  }

  public findClosestAlignment(_draggedRect: IRect): ISnapResult {
    return findClosestAlignment(this._rects, _draggedRect, this._alignThreshold);
  }

  public clearGuides(): void {
    this._lineService.hideVerticalLine();
    this._lineService.hideHorizontalLine();

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }
}
