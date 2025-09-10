import { MoveDragHandler } from '../../move-drag-handler';
import { BaseConnectionDragHandler } from "../../connection-drag-handlers";

export class CreateOutputConnectionHandlerAndSetToNodeHandlerRequest {
  static readonly fToken = Symbol('CreateOutputConnectionHandlerAndSetToNodeHandlerRequest');

  constructor(
    public fDragHandler: MoveDragHandler,
    public inputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[],
  ) {
  }
}
