import { FNodeMoveDragHandler } from '../../../f-node-move.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutOutputConnectionHandlersToArrayRequest {

  constructor(
    public fDragHandler: FNodeMoveDragHandler,
    public inputIds: string[],
    public result: BaseConnectionDragHandler[]
  ) {
  }
}
