import { FNodeMoveDragHandler } from '../../../f-node-move.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';

export class PutInputConnectionHandlersToArrayRequest {
  static readonly fToken = Symbol('PutInputConnectionHandlersToArrayRequest');

  constructor(
    public fDragHandler: FNodeMoveDragHandler,
    public outputIds: string[],
    public result: BaseConnectionDragHandler[]
  ) {
  }
}
