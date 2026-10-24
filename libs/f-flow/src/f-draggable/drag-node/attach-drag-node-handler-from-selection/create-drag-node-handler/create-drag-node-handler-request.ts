import { DragNodeItemHandler } from '../../drag-node-handler';
import type { DragNodeHandler } from '../../drag-node-handler';

export class CreateDragNodeHandlerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: DragNodeHandler;

  static readonly fToken = Symbol('CreateDragNodeHandlerRequest');

  constructor(
    /** Root handlers (handlers without parents in the selection). */
    public readonly rootHandlers: DragNodeItemHandler[],

    /** All handlers participating in the drag operation. */
    public readonly participants: DragNodeItemHandler[],
  ) {}
}
