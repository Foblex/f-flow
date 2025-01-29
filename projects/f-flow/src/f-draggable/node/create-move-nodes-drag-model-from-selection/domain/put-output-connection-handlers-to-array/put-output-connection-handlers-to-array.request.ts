import { NodeDragHandler } from '../../../node.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutOutputConnectionHandlersToArrayRequest {

  constructor(
    public fDragHandler: NodeDragHandler,
    public inputIds: string[],
    public result: BaseConnectionDragHandler[]
  ) {
  }
}
