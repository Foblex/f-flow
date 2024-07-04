import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './create-move-nodes-drag-model-from-selection';
import { NODE_MOVE_FINALIZE_PROVIDERS } from './node-move-finalize';
import { NODE_MOVE_PREPARATION_PROVIDERS } from './node-move-preparation';

export const NODE_PROVIDERS = [

  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  ...NODE_MOVE_FINALIZE_PROVIDERS,

  ...NODE_MOVE_PREPARATION_PROVIDERS,
];
