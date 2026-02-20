import { DRAG_CANVAS_PROVIDERS } from './drag-canvas';
import { DRAG_CONNECTIONS_PROVIDERS } from './connection';
import { DRAG_SELECT_BY_POINTER_PROVIDERS } from './select-by-pointer';
import { NODE_PROVIDERS } from './drag-node';
import { NODE_RESIZE_PROVIDERS } from './resize-node';
import { DRAG_AND_DROP_COMMON_PROVIDERS } from './domain';
import { DRAG_DROP_TO_GROUP_PROVIDERS } from './drop-to-group';
import { NODE_ROTATE_PROVIDERS } from './rotate-node';
import { PINCH_TO_ZOOM_PROVIDERS } from './pinch-to-zoom';
import { DRAG_SELECTION_AREA_PROVIDERS } from './selection-area';
import { DRAG_EXTERNAL_ITEM_PROVIDERS } from './drag-external-item';
import { DRAG_MINIMAP_PROVIDERS } from './drag-minimap';

export const F_DRAGGABLE_PROVIDERS = [
  ...DRAG_CANVAS_PROVIDERS,

  ...DRAG_CONNECTIONS_PROVIDERS,

  ...DRAG_AND_DROP_COMMON_PROVIDERS,

  ...DRAG_SELECT_BY_POINTER_PROVIDERS,

  ...DRAG_EXTERNAL_ITEM_PROVIDERS,

  ...DRAG_MINIMAP_PROVIDERS,

  ...NODE_PROVIDERS,

  ...DRAG_DROP_TO_GROUP_PROVIDERS,

  ...NODE_RESIZE_PROVIDERS,

  ...NODE_ROTATE_PROVIDERS,

  ...DRAG_SELECTION_AREA_PROVIDERS,

  ...PINCH_TO_ZOOM_PROVIDERS,
];
