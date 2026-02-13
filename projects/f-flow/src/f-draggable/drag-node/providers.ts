import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './attach-drag-node-handler-from-selection';
import { DragNodeFinalize } from './drag-node-finalize';
import { DragNodePreparation } from './drag-node-preparation';
import { MagneticLinesPreparation } from './magnetic-lines';

export const NODE_PROVIDERS = [
  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  MagneticLinesPreparation,

  DragNodeFinalize,

  DragNodePreparation,
];
