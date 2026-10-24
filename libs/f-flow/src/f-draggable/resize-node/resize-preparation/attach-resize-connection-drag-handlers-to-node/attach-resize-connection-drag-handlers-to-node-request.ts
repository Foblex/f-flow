import { FNodeBase } from '../../../../f-node';
import { ResizeNodeHandler } from '../../resize-node-handler';

export class AttachResizeConnectionDragHandlersToNodeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AttachResizeConnectionDragHandlersToNodeRequest');

  constructor(
    public readonly handler: ResizeNodeHandler,
    public readonly nodeOrGroup: FNodeBase,
  ) {}
}
