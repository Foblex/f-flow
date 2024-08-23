import { CANVAS_PROVIDERS } from './canvas';
import { CONNECTIONS_PROVIDERS } from './connections';
import { SINGLE_SELECT_PROVIDERS } from './single-select';
import { NODE_PROVIDERS } from './node';
import { NODE_RESIZE_PROVIDERS } from './node-resize';
import { F_MINIMAP_DRAG_AND_DROP_PROVIDERS } from '../f-minimap/domain/providers';
import { F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS } from '../f-external-item/domain/providers';
import { F_SELECTION_AREA_DRAG_AND_DROP_PROVIDERS } from '../f-selection-area/domain/providers';

export const F_DRAGGABLE_PROVIDERS = [

  ...CANVAS_PROVIDERS,

  ...CONNECTIONS_PROVIDERS,

  ...SINGLE_SELECT_PROVIDERS,

  ...F_EXTERNAL_ITEM_DRAG_AND_DROP_PROVIDERS,

  ...NODE_PROVIDERS,

  ...NODE_RESIZE_PROVIDERS,

  ...F_SELECTION_AREA_DRAG_AND_DROP_PROVIDERS,

  ...F_MINIMAP_DRAG_AND_DROP_PROVIDERS
];
