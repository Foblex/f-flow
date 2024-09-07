import { NodeDragHandler } from '../../../node.drag-handler';
import { IDraggableItem } from '../../../../i-draggable-item';

export class PutInputConnectionHandlersToArrayRequest {

  constructor(
    public nodeDragHandler: NodeDragHandler,
    public outputIds: string[],
    public result: IDraggableItem[]
  ) {
  }
}
