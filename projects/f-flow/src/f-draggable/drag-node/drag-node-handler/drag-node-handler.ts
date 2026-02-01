import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { DragNodeItemHandler } from './drag-node-item-handler';
import { Injectable } from '@angular/core';
import { DragHandlerBase } from '../../infrastructure';
import { FDragNodeStartEventData } from '../f-drag-node-start-event-data';
import { SnapLinesDragHandler } from '../create-snap-lines/snap-lines.drag-handler';
import { ISnapResult } from '../../../f-line-alignment';

@Injectable()
export class DragNodeHandler extends DragHandlerBase<FDragNodeStartEventData> {
  protected readonly type = 'move-node';
  protected readonly kind = 'drag-node';

  protected override data(): FDragNodeStartEventData {
    return new FDragNodeStartEventData(this.items.map((x) => x.nodeOrGroup.fId()));
  }

  private _lineAlignment: SnapLinesDragHandler | null = null;

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

  public setLineAlignment(handler: SnapLinesDragHandler): void {
    this._lineAlignment = handler;
  }

  public findClosestAlignment(delta: IPoint): ISnapResult | undefined {
    // preview move roots to update their last rects
    for (const root of this.roots) {
      root.onPointerMove(delta);
    }

    return this._lineAlignment?.findClosestAlignment(this._rootsUnionRect());
  }

  public override prepareDragSequence(): void {
    for (const root of this.roots) {
      root.prepareDragSequence();
    }
  }

  public override onPointerMove(delta: IPoint): void {
    for (const root of this.roots) {
      root.onPointerMove(delta);
    }

    this._lineAlignment?.drawGuidesFor(this._rootsUnionRect());
  }

  public override onPointerUp(): void {
    for (const root of this.roots) {
      root.onPointerUp();
    }

    this._lineAlignment?.clearGuides();
    requestAnimationFrame(() => this._refreshDraggedNodes());
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
    for (const root of this.roots) {
      root.destroy?.();
    }
  }
}
