import { CreateMoveNodesDragModelFromSelectionExecution } from './create-move-nodes-drag-model-from-selection.execution';
import { CalculateNodeMoveLimitsExecution } from './domain/calculate-node-move-limits';
import { PutInputConnectionHandlersToArrayExecution } from './domain/put-input-connection-handlers-to-array';
import { PutOutputConnectionHandlersToArrayExecution } from './domain/put-output-connection-handlers-to-array';
import { CalculateCommonNodeMoveLimitsExecution } from './domain/calculate-common-node-move-limits';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [

  CalculateCommonNodeMoveLimitsExecution,

  CalculateNodeMoveLimitsExecution,

  PutInputConnectionHandlersToArrayExecution,

  PutOutputConnectionHandlersToArrayExecution,

  CreateMoveNodesDragModelFromSelectionExecution,
];
