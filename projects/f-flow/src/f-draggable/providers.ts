import { CANVAS_PROVIDERS } from './f-canvas';
import { CONNECTIONS_PROVIDERS } from './f-connection';
import { SINGLE_SELECT_PROVIDERS } from './single-select';
import { NODE_PROVIDERS } from './node';
import { NODE_RESIZE_PROVIDERS } from './node-resize';
import { F_MINIMAP_DRAG_AND_DROP_PROVIDERS } from '../f-minimap/domain/providers';
import { F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS } from '../f-external-item';
import { F_SELECTION_AREA_DRAG_AND_DROP_PROVIDERS } from '../f-selection-area';
import { DRAG_AND_DROP_COMMON_PROVIDERS } from './domain';

export const F_DRAGGABLE_PROVIDERS = [

  ...CANVAS_PROVIDERS,

  ...CONNECTIONS_PROVIDERS,

  ...DRAG_AND_DROP_COMMON_PROVIDERS,

  ...SINGLE_SELECT_PROVIDERS,

  ...F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS,

  ...NODE_PROVIDERS,

  ...NODE_RESIZE_PROVIDERS,

  ...F_SELECTION_AREA_DRAG_AND_DROP_PROVIDERS,

  ...F_MINIMAP_DRAG_AND_DROP_PROVIDERS
];
