import { IPoint, Point, PointExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFDraggableType } from '../e-f-draggable-type';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { FNodeBase } from '../../f-node';

export class NodeDragHandler implements IDraggableItem {

  public readonly type: EFDraggableType = EFDraggableType.NODE;

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
      private fDraggableDataContext: FDraggableDataContext,
      public fNode: FNodeBase
  ) {
    this.onPointerDownPosition = this.fNode.position;
  }

  public move(difference: IPoint): void {
    const position = Point.fromPoint(this.onPointerDownPosition).add(difference);
    this.fNode.updatePosition(position);
    this.fNode.redraw();
    this.fDraggableDataContext.fLineAlignment?.handle(difference);
  }

  public complete(): void {
    this.fNode.positionChange.emit(this.fNode.position);
  }
}
