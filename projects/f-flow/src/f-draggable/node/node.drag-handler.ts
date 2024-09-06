import { IPoint, Point, PointExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { FNodeBase } from '../../f-node';
import {
  INodeMoveRestrictions
} from './create-move-nodes-drag-model-from-selection';

export class NodeDragHandler implements IDraggableItem {

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
    public fNode: FNodeBase,
    public minDistance: IPoint,
    public maxDistance: IPoint,
  ) {
    this.onPointerDownPosition = { ...fNode.position };
  }

  public move(difference: IPoint): void {
    const restrictedDifference = this.getDifference(difference, { min: this.minDistance, max: this.maxDistance });

    this.redrawNode(this.getNewPosition(restrictedDifference));
    this.fDraggableDataContext.fLineAlignment?.handle(restrictedDifference);
  }

  private getNewPosition(difference: IPoint): IPoint {
    return Point.fromPoint(this.onPointerDownPosition).add(difference);
  }

  private getDifference(difference: IPoint, restrictions: INodeMoveRestrictions): IPoint {
    return {
      x: Math.min(Math.max(difference.x, restrictions.min.x), restrictions.max.x),
      y: Math.min(Math.max(difference.y, restrictions.min.y), restrictions.max.y)
    }
  }

  private redrawNode(position: IPoint): void {
    this.fNode.updatePosition(position);
    this.fNode.redraw();
  }

  public complete(): void {
    this.fNode.positionChange.emit(this.fNode.position);
  }
}
