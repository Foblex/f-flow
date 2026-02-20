import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { DragNodeItemHandler } from './drag-node-item-handler';
import { inject, Injectable } from '@angular/core';
import { DragHandlerBase } from '../../infrastructure';
import { FDragNodeStartEventData } from '../f-drag-node-start-event-data';
import { IMagneticGuidesResult, MagneticLinesHandler } from '../magnetic-lines';
import { IMagneticRectsResult, MagneticRectsHandler } from '../magnetic-rects';
import { FGeometryCache } from '../../../domain/geometry-cache';

@Injectable()
export class DragNodeHandler extends DragHandlerBase<FDragNodeStartEventData> {
  private readonly _geometryCache = inject(FGeometryCache);

  protected readonly type = 'move-node';
  protected readonly kind = 'drag-node';

  protected override data(): FDragNodeStartEventData {
    return new FDragNodeStartEventData(this.items.map((x) => x.nodeOrGroup.fId()));
  }

  private _magneticLines: MagneticLinesHandler | null = null;
  private _magneticRects: MagneticRectsHandler | null = null;

  /** Every dragged item (nodes + groups including deep children) */
  public items!: DragNodeItemHandler[];
  /** Roots of drag hierarchy (top-level items without selected parents) */
  public roots!: DragNodeItemHandler[];

  public initialize(
    /** Every dragged item (nodes + groups including deep children) */
    items: DragNodeItemHandler[],
    /** Roots of drag hierarchy (top-level items without selected parents) */
    roots: DragNodeItemHandler[],
  ): void {
    this.items = items;
    this.roots = roots;
  }

  public setMagneticLines(handler: MagneticLinesHandler): void {
    this._magneticLines = handler;
  }

  public setMagneticRects(handler: MagneticRectsHandler): void {
    this._magneticRects = handler;
  }

  public calculateMagneticLinesGuides(delta: IPoint): IMagneticGuidesResult | undefined {
    return this.calculateMagneticSnaps(delta).lines;
  }

  public calculateMagneticSnaps(delta: IPoint): {
    lines?: IMagneticGuidesResult;
    rects?: IMagneticRectsResult;
  } {
    // preview move roots to update their last rects
    this._previewRoots(delta);

    const draggedRect = this._rootsUnionRect();

    return {
      lines: this._magneticLines?._computeGuides(draggedRect),
      rects: this._magneticRects?._computeRects(draggedRect),
    };
  }

  public override prepareDragSequence(): void {
    for (const item of this.items) {
      this._geometryCache.beginDragSession(item.nodeOrGroup.fId());
    }

    for (const root of this.roots) {
      root.prepareDragSequence();
    }
  }

  public override onPointerMove(delta: IPoint): void {
    this._previewRoots(delta);

    const draggedRect = this._rootsUnionRect();
    this._magneticLines?.scheduleRender(draggedRect);
    this._magneticRects?.scheduleRender(draggedRect);
  }

  public override onPointerUp(): void {
    for (const root of this.roots) {
      root.onPointerUp();
    }

    for (const item of this.items) {
      this._geometryCache.endDragSession(item.nodeOrGroup.fId());
    }

    this._magneticLines?.clearGuides();
    this._magneticRects?.clearGuides();
    requestAnimationFrame(() => this._refreshDraggedNodes());
  }

  private _previewRoots(delta: IPoint): void {
    for (const root of this.roots) {
      root.onPointerMove(delta);
    }
  }

  private _rootsUnionRect(): IRect {
    let result: IRect | null = null;

    for (const root of this.roots) {
      const rect = root.getLastRect();
      result = result ? RectExtensions.union([result, rect]) : rect;
    }

    return result ?? RectExtensions.initialize();
  }

  private _refreshDraggedNodes(): void {
    for (const { nodeOrGroup } of this.roots) {
      nodeOrGroup.refresh();
    }
  }

  public override destroy(): void {
    for (const item of this.items ?? []) {
      this._geometryCache.endDragSession(item.nodeOrGroup.fId());
    }

    for (const root of this.roots ?? []) {
      root.destroy?.();
    }
  }
}
