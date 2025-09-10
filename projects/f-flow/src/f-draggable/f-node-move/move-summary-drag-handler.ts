import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { MoveDragHandler } from './move-drag-handler';
import { Injector } from "@angular/core";
import { SnapLinesDragHandler } from "./create-snap-lines/snap-lines.drag-handler";
import { ISnapResult } from "../../f-line-alignment";

export class MoveSummaryDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';
  public readonly fData: any;

  private _lineAlignment: SnapLinesDragHandler | null = null;

  constructor(
    _injector: Injector,
    public allDraggedNodeHandlers: MoveDragHandler[],
    public rootHandlers: MoveDragHandler[],
  ) {
    this.fData = {
      fNodeIds: allDraggedNodeHandlers.map((x) => x.nodeOrGroup.fId()),
    };
  }

  public setLineAlignment(handler: SnapLinesDragHandler): void {
    this._lineAlignment = handler;
  }

  public findClosestAlignment(difference: IPoint): ISnapResult | undefined {
    this.rootHandlers.forEach((x) => x.onPointerMove(difference));

    return this._lineAlignment?.findClosestAlignment(this._unionRect());
  }

  public prepareDragSequence(): void {
    this.rootHandlers.forEach((x) => x.prepareDragSequence());
  }

  public onPointerMove(difference: IPoint): void {
    this.rootHandlers.forEach((x) => x.onPointerMove(difference));
    this._lineAlignment?.drawGuidesFor(this._unionRect());
  }

  public onPointerUp(): void {
    this.rootHandlers.forEach((x) => x.onPointerUp());
    this._lineAlignment?.clearGuides();
    requestAnimationFrame(() => this._refreshDraggedNodes());
  }

  private _unionRect(): IRect {
    return RectExtensions.union(this._getRootRects()) || RectExtensions.initialize();
  }

  private _getRootRects(): IRect[] {
    return this.rootHandlers.map((x) => x.getLastRect());
  }

  private _refreshDraggedNodes(): void {
    this.rootHandlers.forEach(({ nodeOrGroup }) => nodeOrGroup.refresh());
  }
}
