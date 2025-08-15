import {CreateMoveNodesDragModelFromSelectionExecution} from './create-move-nodes-drag-model-from-selection.execution';
import {PutInputConnectionHandlersToArrayExecution} from './domain/put-input-connection-handlers-to-array';
import {PutOutputConnectionHandlersToArrayExecution} from './domain/put-output-connection-handlers-to-array';
import {CalculateSummaryDragLimits} from './domain/calculate-summary-drag-limits';
import {BuildDragHierarchy} from "./domain/build-drag-hierarchy";
import {CalculateDragLimits} from "./domain/calculate-drag-limits";
import {CreateSummaryDragHandler} from "./domain/create-summary-drag-handler";

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [

  BuildDragHierarchy,

  CalculateDragLimits,

  CalculateSummaryDragLimits,

  CreateSummaryDragHandler,

  PutInputConnectionHandlersToArrayExecution,

  PutOutputConnectionHandlersToArrayExecution,

  CreateMoveNodesDragModelFromSelectionExecution,
];
