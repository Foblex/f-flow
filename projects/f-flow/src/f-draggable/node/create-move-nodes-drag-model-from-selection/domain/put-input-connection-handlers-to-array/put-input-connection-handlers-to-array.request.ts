import { NodeDragHandler } from '../../../node.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutInputConnectionHandlersToArrayRequest {

  constructor(
    public fDragHandler: NodeDragHandler,
    public outputIds: string[],
    public result: BaseConnectionDragHandler[]
  ) {
  }
}
