import { IMinMaxPoint, IPoint, IRect } from '@foblex/2d';
import { IFDragHandler } from '../f-drag-handler';
import { FComponentsStore } from '../../f-storage';
import { fInject } from '../f-injector';
import { PointBoundsLimiter } from './point-bounds-limiter';
import { NodeDragHandler } from './node.drag-handler';

// import { FMediator } from '@foblex/mediator';

export class SummaryNodeDragHandler implements IFDragHandler {

  public fEventType = 'move-node';
  public fData: any;
  // private _fMediator = fInject(FMediator);
  private _fComponentStore = fInject(FComponentsStore);

  private readonly _fBoundsLimiter: PointBoundsLimiter;

  constructor(
    public limits: IMinMaxPoint,
    public fHandlers: NodeDragHandler[],
    public commonRect: IRect
  ) {
    //this._onPointerDownPosition = this._getDraggedNodesBoundingRect();
    this._fBoundsLimiter = new PointBoundsLimiter(this.commonRect, limits);
    this.fData = {
      fNodeIds: this.fHandlers.map((x) => x.fNode.fId)
    };
  }

  // private _getDraggedNodesBoundingRect(): IRect {
  //   return RectExtensions.union(this.fHandlers.map((x) => {
  //     return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.fNode.hostElement, false));
  //   })) || RectExtensions.initialize();
  // }

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
