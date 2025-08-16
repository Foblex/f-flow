import { MoveNodeOrGroupDragHandler } from '../../move-node-or-group.drag-handler';
import { BaseConnectionDragHandler } from '../../connection-drag-handlers';

export class CreateInputConnectionHandlerAndSetToNodeHandlerRequest {
  static readonly fToken = Symbol('CreateInputConnectionHandlerAndSetToNodeHandlerRequest');

  constructor(
    public dragHandler: MoveNodeOrGroupDragHandler,
    public outputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[]
  ) {
  }
}
