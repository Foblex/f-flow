import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './create-drag-model-from-selection';
import { FNodeMoveFinalizeExecution } from './move-finalize';
import { FNodeMovePreparationExecution } from './move-preparation';
import { CreateSnapLines } from './create-snap-lines';

export const NODE_PROVIDERS = [

  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  CreateSnapLines,

  FNodeMoveFinalizeExecution,

  FNodeMovePreparationExecution,
];
