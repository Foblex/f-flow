import { DragHandlerBase } from '../infrastructure';
import { DragMinimapHandler } from './drag-minimap-handler';

export const DRAG_MINIMAP_HANDLER_TYPE = 'minimap';
export const DRAG_MINIMAP_HANDLER_KIND = 'minimap';

export function isDragMinimapHandler(value: DragHandlerBase<unknown>): value is DragMinimapHandler {
  return (
    value.getEvent().kind === DRAG_MINIMAP_HANDLER_KIND ||
    value.getEvent().fEventType === DRAG_MINIMAP_HANDLER_TYPE
  );
}
