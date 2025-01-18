import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FNodeBase } from '../../f-node';
import {
  INodeMoveRestrictions
} from './create-move-nodes-drag-model-from-selection';
import { FComponentsStore } from '../../f-storage';

export class NodeDragHandler implements IDraggableItem {

  private readonly _onPointerDownPosition = PointExtensions.initialize();

  constructor(
    private _fComponentsStore: FComponentsStore,
    public fNode: FNodeBase,
    public minDistance: IPoint,
    public maxDistance: IPoint,
  ) {
    this._onPointerDownPosition = { ...fNode.position };
  }

  public onPointerMove(difference: IPoint): void {
    const restrictedDifference = this._getDifference(difference, { min: this.minDistance, max: this.maxDistance });

    this._redraw(this._getPosition(restrictedDifference));
    this._fComponentsStore.fLineAlignment?.handle(restrictedDifference);
  }

  private _getPosition(difference: IPoint): IPoint {
    return Point.fromPoint(this._onPointerDownPosition).add(difference);
  }

  private _getDifference(difference: IPoint, restrictions: INodeMoveRestrictions): IPoint {
    return {
      x: Math.min(Math.max(difference.x, restrictions.min.x), restrictions.max.x),
      y: Math.min(Math.max(difference.y, restrictions.min.y), restrictions.max.y)
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
    const restrictedDifference = this._getDifference(difference, { min: this.minDistance, max: this.maxDistance });
    const position = this._getPosition(restrictedDifference);

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
