import { DragCanvasPreparation } from './drag-canvas-preparation';
import { DragCanvasFinalize } from './drag-canvas-finalize';
import { fExecution } from '../../_libs/f-mediator';
import { DragCanvasFinalizeRequest } from './drag-canvas-finalize/drag-canvas-finalize-request';
import { DragCanvasPreparationRequest } from './drag-canvas-preparation/drag-canvas-preparation-request';

export const DRAG_CANVAS_PROVIDERS = [
  fExecution(DragCanvasFinalizeRequest, DragCanvasFinalize),
  fExecution(DragCanvasPreparationRequest, DragCanvasPreparation),
];
