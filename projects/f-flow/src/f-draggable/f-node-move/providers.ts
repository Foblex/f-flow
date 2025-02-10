import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './create-move-nodes-drag-model-from-selection';
import { FNodeMoveFinalizeExecution } from './move-finalize';
import { FNodeMovePreparationExecution } from './move-preparation';
import { LineAlignmentPreparationExecution } from './line-alignment-preparation';

export const NODE_PROVIDERS = [

  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  LineAlignmentPreparationExecution,

  FNodeMoveFinalizeExecution,

  FNodeMovePreparationExecution,
];
