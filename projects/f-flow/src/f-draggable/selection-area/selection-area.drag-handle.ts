import { IPoint, Point, RectExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFDraggableType } from '../e-f-draggable-type';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../f-draggable-data-context';
import { ISelectableWithRect } from '../../domain';
import { ISelectable } from '../../f-connection';
import { FFlowMediator } from '../../infrastructure';
import { GetCanBeSelectedItemsRequest } from '../../domain/get-can-be-selected-items/get-can-be-selected-items-request';

export class SelectionAreaDragHandle implements IDraggableItem {

  public readonly type: EFDraggableType = EFDraggableType.SELECTION;

  private canBeSelected: ISelectableWithRect[] = [];

  private selectedByMove: ISelectable[] = [];

  private get canvasPosition(): Point {
    return Point.fromPoint(this.fComponentsStore.fCanvas!.transform.position).add(this.fComponentsStore.fCanvas!.transform.scaledPosition);
  }

  constructor(
      private fComponentsStore: FComponentsStore,
      private fDraggableDataContext: FDraggableDataContext,
      private fMediator: FFlowMediator,
  ) {
  }

  public initialize(): void {
    this.canBeSelected = this.fMediator.send(new GetCanBeSelectedItemsRequest());

    this.fDraggableDataContext.fSelectionArea?.show();
    this.fDraggableDataContext.fSelectionArea?.draw({
      left: this.fDraggableDataContext.onPointerDownPosition.x,
      top: this.fDraggableDataContext.onPointerDownPosition.y,
      width: 0,
      height: 0
    });
  }

  public move(difference: IPoint): void {
    const currentPoint = Point.fromPoint(difference).add(this.fDraggableDataContext.onPointerDownPosition);
    const x: number = Math.min(this.fDraggableDataContext.onPointerDownPosition.x, currentPoint.x);
    const y: number = Math.min(this.fDraggableDataContext.onPointerDownPosition.y, currentPoint.y);

    const width = Math.abs(difference.x);
    const height = Math.abs(difference.y);

    this.fDraggableDataContext.fSelectionArea?.draw({ left: x, top: y, width, height });
    this.selectedByMove = [];
    this.canBeSelected.forEach((item) => {
      item.element.deselect();

      const itemRect = RectExtensions.addPoint(item.rect, this.canvasPosition);

      const isIntersect = RectExtensions.intersectionWithRect(itemRect, RectExtensions.initialize(x, y, width, height));
      if (isIntersect) {

        item.element.select();
        this.selectedByMove.push(item.element);
      }
    });
  }

  public complete(): void {
    this.fDraggableDataContext.fSelectionArea?.hide();
    this.fDraggableDataContext.selectedItems.push(...this.selectedByMove);
    if (this.selectedByMove.length > 0) {
      this.fDraggableDataContext.isSelectedChanged = true;
    }
  }
}
