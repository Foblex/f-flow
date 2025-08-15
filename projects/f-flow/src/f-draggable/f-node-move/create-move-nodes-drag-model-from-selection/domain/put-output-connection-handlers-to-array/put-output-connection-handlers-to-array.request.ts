import { MoveNodeOrGroupDragHandler } from '../../../move-node-or-group.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutOutputConnectionHandlersToArrayRequest {
  static readonly fToken = Symbol('PutOutputConnectionHandlersToArrayRequest');

  constructor(
    public fDragHandler: MoveNodeOrGroupDragHandler,
    public inputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[]
  ) {
  }
}
