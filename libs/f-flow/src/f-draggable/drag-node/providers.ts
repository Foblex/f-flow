import { CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS } from './attach-drag-node-handler-from-selection';
import { DragNodeFinalize } from './drag-node-finalize';
import { DragNodePreparation } from './drag-node-preparation';
import { MagneticLinesPreparation } from './magnetic-lines';
import { MagneticRectsPreparation } from './magnetic-rects';
import { fExecution } from '../../_libs/f-mediator';
import { DragNodeFinalizeRequest } from './drag-node-finalize/drag-node-finalize-request';
import { DragNodePreparationRequest } from './drag-node-preparation/drag-node-preparation-request';
import { MagneticLinesPreparationRequest } from './magnetic-lines/magnetic-lines-preparation/magnetic-lines-preparation-request';
import { MagneticRectsPreparationRequest } from './magnetic-rects/magnetic-rects-preparation/magnetic-rects-preparation-request';

export const NODE_PROVIDERS = [
  ...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,

  fExecution(MagneticLinesPreparationRequest, MagneticLinesPreparation),
  fExecution(MagneticRectsPreparationRequest, MagneticRectsPreparation),

  fExecution(DragNodeFinalizeRequest, DragNodeFinalize),

  fExecution(DragNodePreparationRequest, DragNodePreparation),
];
