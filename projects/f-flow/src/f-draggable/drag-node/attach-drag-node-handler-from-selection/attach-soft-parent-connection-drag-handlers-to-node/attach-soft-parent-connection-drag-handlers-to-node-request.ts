import { IDragNodeDeltaConstraints } from '../../drag-node-constraint';
import { DragNodeConnectionHandlerBase } from '../../drag-node-dependent-connection-handlers';
import { DragNodeItemHandler } from '../../drag-node-handler';

export class AttachSoftParentConnectionDragHandlersToNodeRequest {
  static readonly fToken = Symbol('AttachSoftParentConnectionDragHandlersToNodeRequest');

  constructor(
    /** Node move handler that owns soft parent constraints. */
    public readonly dragHandler: DragNodeItemHandler,

    /** Constraints calculated for the root handler. */
    public readonly constraints: IDragNodeDeltaConstraints,

    /** Shared pool to reuse already created handlers for the same connection. */
    public readonly handlerPool: DragNodeConnectionHandlerBase[],
  ) {}
}
