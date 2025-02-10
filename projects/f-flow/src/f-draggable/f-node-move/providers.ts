import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './create-move-nodes-drag-model-from-selection';
import { NodeMoveFinalizeExecution } from './move-finalize';
import { NODE_MOVE_PREPARATION_PROVIDERS } from './move-preparation';
import { LineAlignmentPreparationExecution } from './line-alignment-preparation';

export const NODE_PROVIDERS = [

  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  LineAlignmentPreparationExecution,

  NodeMoveFinalizeExecution,

  ...NODE_MOVE_PREPARATION_PROVIDERS,
];
