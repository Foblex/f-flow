import { MoveNodeOrGroupDragHandler } from '../../../move-node-or-group.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutInputConnectionHandlersToArrayRequest {
  static readonly fToken = Symbol('PutInputConnectionHandlersToArrayRequest');

  constructor(
    public fDragHandler: MoveNodeOrGroupDragHandler,
    public outputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[]
  ) {
  }
}
