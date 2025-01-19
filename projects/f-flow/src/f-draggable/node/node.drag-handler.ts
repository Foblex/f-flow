import { IMinMaxPoint, IPoint, Point, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FNodeBase } from '../../f-node';
import { FComponentsStore } from '../../f-storage';

export class NodeDragHandler implements IDraggableItem {

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  constructor(
    private _fComponentsStore: FComponentsStore,
    public fNode: FNodeBase,
    public restrictions: IMinMaxPoint,
  ) {
    this._onPointerDownPosition = { ...fNode.position };
  }

  public onPointerMove(difference: IPoint): void {
    const restrictedDifference = this._getDifference(difference);

    this._redraw(this._getPosition(restrictedDifference));
  }

  private _getPosition(difference: IPoint): IPoint {
    return Point.fromPoint(this._onPointerDownPosition).add(difference);
  }

  private _getDifference(difference: IPoint): IPoint {
    return {
      x: Math.min(Math.max(difference.x, this.restrictions.min.x), this.restrictions.max.x),
      y: Math.min(Math.max(difference.y, this.restrictions.min.y), this.restrictions.max.y)
    }
  }

  private _redraw(position: IPoint): void {
    this.fNode.updatePosition(position);
    this.fNode.redraw();
  }

  public onPointerUp(): void {
    this.fNode.positionChange.emit(this.fNode.position);
  }

  public getDifferenceWithCellSize(difference: IPoint): IPoint {
    const position = this._getPosition(this._getDifference(difference));

    return Point.fromPoint(this._applyCellSize(position)).sub(this._onPointerDownPosition);
  }

  private _applyCellSize(position: IPoint): IPoint {
    const hCellSize = this._fComponentsStore.fDraggable!.hCellSize;
    const vCellSize = this._fComponentsStore.fDraggable!.vCellSize;
    return {
      x: Math.round(position.x / hCellSize) * hCellSize,
      y: Math.round(position.y / vCellSize) * vCellSize
    };
  }
}
