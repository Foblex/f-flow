import { DragNodeItemHandler } from '../../drag-node-handler';

export class CreateDragNodeHandlerRequest {
  static readonly fToken = Symbol('CreateDragNodeHandlerRequest');

  constructor(
    /** Root handlers (handlers without parents in the selection). */
    public readonly rootHandlers: DragNodeItemHandler[],

    /** All handlers participating in the drag operation. */
    public readonly participants: DragNodeItemHandler[],
  ) {}
}
