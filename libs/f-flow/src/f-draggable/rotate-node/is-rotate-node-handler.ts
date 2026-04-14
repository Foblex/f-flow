import { DragHandlerBase } from '../infrastructure';
import { RotateNodeHandler } from './rotate-node-handler';

export const ROTATE_NODE_HANDLER_TYPE = 'node-rotate';
export const ROTATE_NODE_HANDLER_KIND = 'rotate-node';

export function isRotateNodeHandler(value: DragHandlerBase<unknown>): value is RotateNodeHandler {
  return (
    value.getEvent().kind === ROTATE_NODE_HANDLER_KIND ||
    value.getEvent().fEventType === ROTATE_NODE_HANDLER_TYPE
  );
}
