import { IMinMaxPoint, IPoint, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FNodeBase } from '../../f-node';
import { FComponentsStore } from '../../f-storage';
import { fInject } from '../f-injector';
import { PointBoundsLimiter } from './point-bounds-limiter';
import { BaseConnectionDragHandler } from './base-connection.drag-handler';

export class NodeDragHandler implements IDraggableItem {

  private _fComponentStore = fInject(FComponentsStore);
  private readonly _onPointerDownPosition = PointExtensions.initialize();

  private readonly _fBoundsLimiter: PointBoundsLimiter;

  constructor(
    public fNode: FNodeBase,
    public restrictions: IMinMaxPoint,
    public fSourceHandlers: BaseConnectionDragHandler[] = [],
    public fTargetHandlers: BaseConnectionDragHandler[] = [],
  ) {
    this._onPointerDownPosition = { ...fNode.position };
    this._fBoundsLimiter = new PointBoundsLimiter(this._onPointerDownPosition, restrictions);
  }

  public onPointerMove(difference: IPoint): void {
    const adjustCellSize = this._fComponentStore.fDraggable!.fCellSizeWhileDragging;
    const differenceWithRestrictions = this._fBoundsLimiter.limit(difference, adjustCellSize);

    this._redraw(this._calculateNewPosition(differenceWithRestrictions));

    this.fSourceHandlers.forEach((x) => x.setSourceDifference(differenceWithRestrictions));
    this.fTargetHandlers.forEach((x) => x.setTargetDifference(differenceWithRestrictions));
  }

  private _calculateNewPosition(difference: IPoint): IPoint {
    return PointExtensions.sum(this._onPointerDownPosition, difference);
  }

  private _redraw(position: IPoint): void {
    this.fNode.updatePosition(position);
    this.fNode.redraw();
  }

  public onPointerUp(): void {
    this.fNode.positionChange.emit(this.fNode.position);
  }

  public calculateRestrictedDifference(difference: IPoint): IPoint {
    return this._fBoundsLimiter.limit(difference, true);
  }
}
