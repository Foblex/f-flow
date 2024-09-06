import { NodeDragHandler } from '../../../node.drag-handler';
import { IDraggableItem } from '../../../../i-draggable-item';

export class PutOutputConnectionHandlersToArrayRequest {

  constructor(
    public nodeDragHandler: NodeDragHandler,
    public inputIds: string[],
    public result: IDraggableItem[]
  ) {
  }
}
