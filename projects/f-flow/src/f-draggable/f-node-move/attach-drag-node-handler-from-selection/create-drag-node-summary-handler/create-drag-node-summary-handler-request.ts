import { MoveDragHandler } from '../../move-drag-handler';

export class CreateDragNodeSummaryHandlerRequest {
  static readonly fToken = Symbol('CreateDragNodeSummaryHandlerRequest');

  constructor(
    /** Root handlers (handlers without parents in the selection). */
    public readonly rootHandlers: MoveDragHandler[],

    /** All handlers participating in the drag operation. */
    public readonly participants: MoveDragHandler[],
  ) {}
}
