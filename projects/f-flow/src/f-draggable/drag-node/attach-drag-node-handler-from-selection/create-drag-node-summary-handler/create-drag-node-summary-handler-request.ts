import { DragNodeItemHandler } from '../../drag-node-item-handler';

export class CreateDragNodeSummaryHandlerRequest {
  static readonly fToken = Symbol('CreateDragNodeSummaryHandlerRequest');

  constructor(
    /** Root handlers (handlers without parents in the selection). */
    public readonly rootHandlers: DragNodeItemHandler[],

    /** All handlers participating in the drag operation. */
    public readonly participants: DragNodeItemHandler[],
  ) {}
}
