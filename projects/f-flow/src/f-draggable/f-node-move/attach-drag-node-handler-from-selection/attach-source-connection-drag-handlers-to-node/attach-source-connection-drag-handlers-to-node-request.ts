import { MoveDragHandler } from '../../move-drag-handler';
import { DragNodeConnectionHandlerBase } from '../../drag-node-dependent-connection-handlers';

export class AttachSourceConnectionDragHandlersToNodeRequest {
  static readonly fToken = Symbol('AttachSourceConnectionDragHandlersToNodeRequest');

  constructor(
    /** Node move handler we attach connection handlers to. */
    public readonly dragHandler: MoveDragHandler,

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
