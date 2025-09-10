import { MoveDragHandler } from '../../move-drag-handler';
import { BaseConnectionDragHandler } from '../../connection-drag-handlers';

export class CreateInputConnectionHandlerAndSetToNodeHandlerRequest {
  static readonly fToken = Symbol('CreateInputConnectionHandlerAndSetToNodeHandlerRequest');

  constructor(
    public dragHandler: MoveDragHandler,
    public outputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[],
  ) {
  }
}
