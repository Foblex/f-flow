import { DragNodeConnectionHandlerBase } from '../../drag-node-dependent-connection-handlers';
import { DragNodeItemHandler } from '../../drag-node-handler';

export class AttachSourceConnectionDragHandlersToNodeRequest {
  static readonly fToken = Symbol('AttachSourceConnectionDragHandlersToNodeRequest');

  constructor(
    /** Node move handler we attach connection handlers to. */
    public readonly dragHandler: DragNodeItemHandler,

    /**
     * Connectors considered "target side" for connections (previously: inputIds).
     * These are target connector ids that are within current drag selection.
     */
    public readonly targetIds: string[],

    /**
     * Shared pool to reuse already created handlers for the same connection.
     */
    public readonly handlerPool: DragNodeConnectionHandlerBase[],
  ) {}
}
