import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './create-move-nodes-drag-model-from-selection';
import { NODE_MOVE_FINALIZE_PROVIDERS } from './node-move-finalize';
import { NODE_MOVE_PREPARATION_PROVIDERS } from './node-move-preparation';
import { NODE_DRAG_TO_PARENT_PREPARATION_PROVIDERS } from './node-drag-to-parent-preparation';
import { NODE_DRAG_TO_PARENT_FINALIZE_PROVIDERS } from './node-drag-to-parent-finalize';

export const NODE_PROVIDERS = [

  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  ...NODE_MOVE_FINALIZE_PROVIDERS,

  ...NODE_MOVE_PREPARATION_PROVIDERS,

  ...NODE_DRAG_TO_PARENT_PREPARATION_PROVIDERS,

  ...NODE_DRAG_TO_PARENT_FINALIZE_PROVIDERS
];
