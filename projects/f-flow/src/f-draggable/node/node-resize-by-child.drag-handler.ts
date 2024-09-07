import { IPoint, PointExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { FDraggableDataContext } from '../f-draggable-data-context';


export class NodeResizeByChildDragHandler implements IDraggableItem {

  private onPointerDownPosition: IPoint = PointExtensions.initialize();

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {

  }


  public move(difference: IPoint): void {

  }

  public complete(): void {

  }
}
