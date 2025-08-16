import { MoveNodeOrGroupDragHandler } from '../../move-node-or-group.drag-handler';
import {BaseConnectionDragHandler} from "../../connection-drag-handlers";

export class CreateOutputConnectionHandlerAndSetToNodeHandlerRequest {
  static readonly fToken = Symbol('CreateOutputConnectionHandlerAndSetToNodeHandlerRequest');

  constructor(
    public fDragHandler: MoveNodeOrGroupDragHandler,
    public inputIds: string[],
    public existingConnectionHandlers: BaseConnectionDragHandler[]
  ) {
  }
}
