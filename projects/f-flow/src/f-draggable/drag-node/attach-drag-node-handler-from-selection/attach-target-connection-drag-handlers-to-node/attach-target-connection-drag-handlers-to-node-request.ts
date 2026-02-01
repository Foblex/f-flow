import { DragNodeItemHandler } from '../../drag-node-item-handler';
import { DragNodeConnectionHandlerBase } from '../../drag-node-dependent-connection-handlers';

export class AttachTargetConnectionDragHandlersToNodeRequest {
  static readonly fToken = Symbol('AttachTargetConnectionDragHandlersToNodeRequest');

  constructor(
    /** Node move handler we attach connection handlers to. */
    public readonly dragHandler: DragNodeItemHandler,

    /**
     * Connectors considered "source side" for connections (previously: outputIds).
     * These are source connector ids that are within current drag selection.
     */
    public readonly sourceIds: string[],

    /**
     * Shared pool to reuse already created handlers for the same connection.
     */
    public readonly handlerPool: DragNodeConnectionHandlerBase[],
  ) {}
}
