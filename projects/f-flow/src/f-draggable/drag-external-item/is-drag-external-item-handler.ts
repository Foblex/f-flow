import { DragHandlerBase } from '../infrastructure';
import { DragExternalItemHandler } from '@foblex/flow';

export const DRAG_EXTERNAL_ITEM_HANDLER_TYPE = 'external-item';
export const DRAG_EXTERNAL_ITEM_HANDLER_KIND = 'drag-external-item';

export function isDragExternalItemHandler(
  value: DragHandlerBase<unknown>,
): value is DragExternalItemHandler {
  return (
    value.getEvent().kind === DRAG_EXTERNAL_ITEM_HANDLER_KIND ||
    value.getEvent().fEventType === DRAG_EXTERNAL_ITEM_HANDLER_TYPE
  );
}
