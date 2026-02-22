import { FNodeBase } from '../../../../f-node';
import { ResizeNodeHandler } from '../../resize-node-handler';

export class AttachResizeConnectionDragHandlersToNodeRequest {
  static readonly fToken = Symbol('AttachResizeConnectionDragHandlersToNodeRequest');

  constructor(
    public readonly handler: ResizeNodeHandler,
    public readonly nodeOrGroup: FNodeBase,
  ) {}
}
