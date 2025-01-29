import { NodeDragHandler } from '../../../node.drag-handler';
import { BaseConnectionDragHandler } from '../../../base-connection.drag-handler';

export class PutInputConnectionHandlersToArrayRequest {

  constructor(
    public fDragHandler: NodeDragHandler,
    public outputIds: string[],
    public result: BaseConnectionDragHandler[]
  ) {
  }
}
