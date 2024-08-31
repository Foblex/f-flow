import { IPoint, ISize, PointExtensions, RectExtensions, SizeExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFResizeHandleType, FNodeBase } from '../../f-node';
import { FComponentsStore } from '../../f-storage';

const RESIZE_DIRECTIONS = {

  [ EFResizeHandleType.LEFT_TOP ]: { x: -1, y: -1 },

  [ EFResizeHandleType.LEFT_BOTTOM ]: { x: -1, y: 1 },

  [ EFResizeHandleType.RIGHT_TOP ]: { x: 1, y: -1 },

  [ EFResizeHandleType.RIGHT_BOTTOM ]: { x: 1, y: 1 },
};

export class NodeResizeDragHandler implements IDraggableItem {

  private readonly onPointerDownPosition: IPoint;

  private readonly rect;

  private get scale(): number {
    return this.fComponentsStore.fCanvas!.transform.scale;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    public fNode: FNodeBase,
    public fResizeHandleType: EFResizeHandleType,
  ) {
    this.onPointerDownPosition = this.fNode.position;
    this.rect = RectExtensions.fromElement(this.fNode.hostElement);
  }

  public move(difference: IPoint): void {
    const sizeAndOffset = this.calculateSize(difference, RESIZE_DIRECTIONS[ this.fResizeHandleType ]);
    const newPosition = this.calculatePosition(difference, RESIZE_DIRECTIONS[ this.fResizeHandleType ], sizeAndOffset.offsetPosition);

    this.fNode.updatePosition(newPosition);
    this.fNode.updateSize(sizeAndOffset.newSize);
    this.fNode.redraw();
  }

  private calculateSize(difference: IPoint, direction: IPoint): { newSize: ISize, offsetPosition: IPoint } {
    const newSize = SizeExtensions.initialize(
      this.rect.width / this.scale + direction.x * difference.x,
      this.rect.height / this.scale + direction.y * difference.y
    );

    let offsetPosition = PointExtensions.initialize(0, 0);

    if (newSize.width < 0) {
      offsetPosition.x = newSize.width;
      newSize.width = Math.abs(newSize.width);
    }

    if (newSize.height < 0) {
      offsetPosition.y = newSize.height;
      newSize.height = Math.abs(newSize.height);
    }

    return { newSize, offsetPosition };
  }

  private calculatePosition(difference: IPoint, direction: IPoint, offsetPosition: IPoint): IPoint {
    return PointExtensions.initialize(
      this.onPointerDownPosition.x + (direction.x === -1 ? difference.x : 0) + offsetPosition.x,
      this.onPointerDownPosition.y + (direction.y === -1 ? difference.y : 0) + offsetPosition.y
    );
  }

  public complete(): void {
    this.fNode.sizeChange.emit(
      RectExtensions.initialize(
        this.fNode.position.x, this.fNode.position.y, this.fNode.size.width, this.fNode.size.height
      )
    );
  }
}
