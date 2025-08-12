import { IMinMaxPoint, IPoint, IRect } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { PointBoundsLimiter } from './point-bounds-limiter';
import { FNodeMoveDragHandler } from './f-node-move.drag-handler';
import { Injector } from '@angular/core';

export class FSummaryNodeMoveDragHandler implements IFDragHandler {

  public readonly fEventType = 'move-node';
  public readonly fData: any;

  private readonly _fComponentStore: FComponentsStore;
  private readonly _fBoundsLimiter: PointBoundsLimiter;

  constructor(
    _injector: Injector,
    public limits: IMinMaxPoint,
    public fHandlers: FNodeMoveDragHandler[],
    public commonRect: IRect
  ) {
    this._fComponentStore = _injector.get(FComponentsStore);
    this._fBoundsLimiter = new PointBoundsLimiter(_injector, this.commonRect, limits);
    this.fData = {
      fNodeIds: this.fHandlers.map((x) => x.fNode.fId())
    };
  }

  public prepareDragSequence(): void {
    this.fHandlers.forEach((x) => x.prepareDragSequence());
  }

  public onPointerMove(difference: IPoint): void {
    const adjustCellSize = this._fComponentStore.fDraggable!.fCellSizeWhileDragging;
    const differenceWithRestrictions = this._fBoundsLimiter.limit(difference, adjustCellSize);

    this.fHandlers.forEach((x) => x.onPointerMove(differenceWithRestrictions));
  }

  public onPointerUp(): void {
    this.fHandlers.forEach((x) => x.onPointerUp());
  }

  public calculateRestrictedDifference(difference: IPoint): IPoint {
    return this._fBoundsLimiter.limit(difference, true);
  }
}
