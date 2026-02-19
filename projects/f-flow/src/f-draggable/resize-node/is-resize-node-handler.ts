import { DragHandlerBase } from '../infrastructure';
import { ResizeNodeHandler } from './resize-node-handler';

export const RESIZE_NODE_HANDLER_TYPE = 'node-resize';
export const RESIZE_NODE_HANDLER_KIND = 'resize-node';

export function isResizeNodeHandler(value: DragHandlerBase<unknown>): value is ResizeNodeHandler {
  return (
    value.getEvent().kind === RESIZE_NODE_HANDLER_KIND ||
    value.getEvent().fEventType === RESIZE_NODE_HANDLER_TYPE
  );
}
