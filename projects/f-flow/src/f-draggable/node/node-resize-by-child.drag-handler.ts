import { IPoint, PointExtensions } from '@foblex/2d';
import { IDraggableItem } from '../i-draggable-item';
import { FDraggableDataContext } from '../f-draggable-data-context';

//TODO: Implement this class
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
