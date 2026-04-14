import { DragHandlerBase } from '../infrastructure';
import { DragNodeHandler } from './drag-node-handler';

export const DRAG_NODE_HANDLER_TYPE = 'move-node';
export const DRAG_NODE_HANDLER_KIND = 'drag-node';

export function isDragNodeHandler(value: DragHandlerBase<unknown>): value is DragNodeHandler {
  return (
    value.getEvent().kind === DRAG_NODE_HANDLER_KIND ||
    value.getEvent().fEventType === DRAG_NODE_HANDLER_TYPE
  );
}
