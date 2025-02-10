import { IMinMaxPoint, IPoint, IRect } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { fInject } from '../f-injector';
import { PointBoundsLimiter } from './point-bounds-limiter';
import { FNodeMoveDragHandler } from './f-node-move.drag-handler';

export class FSummaryNodeMoveDragHandler implements IFDragHandler {

  public fEventType = 'move-node';
  public fData: any;

  private _fComponentStore = fInject(FComponentsStore);

  private readonly _fBoundsLimiter: PointBoundsLimiter;

  constructor(
    public limits: IMinMaxPoint,
    public fHandlers: FNodeMoveDragHandler[],
    public commonRect: IRect
  ) {
    this._fBoundsLimiter = new PointBoundsLimiter(this.commonRect, limits);
    this.fData = {
      fNodeIds: this.fHandlers.map((x) => x.fNode.fId)
    };
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
