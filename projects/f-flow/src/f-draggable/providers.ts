import { CANVAS_PROVIDERS } from './canvas';
import { CONNECTIONS_PROVIDERS } from './connections';
import { SINGLE_SELECT_PROVIDERS } from './single-select';
import { EXTERNAL_ITEM_PROVIDERS } from './external-item';
import { NODE_PROVIDERS } from './node';
import { NODE_RESIZE_PROVIDERS } from './node-resize';
import { SELECTION_AREA_PROVIDERS } from './selection-area';

export const F_DRAGGABLE_PROVIDERS = [

  ...CANVAS_PROVIDERS,

  ...CONNECTIONS_PROVIDERS,

  ...SINGLE_SELECT_PROVIDERS,

  ...EXTERNAL_ITEM_PROVIDERS,

  ...NODE_PROVIDERS,

  ...NODE_RESIZE_PROVIDERS,

  ...SELECTION_AREA_PROVIDERS
];
