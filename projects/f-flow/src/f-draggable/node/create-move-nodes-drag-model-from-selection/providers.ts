import { CreateMoveNodesDragModelFromSelectionExecution } from './create-move-nodes-drag-model-from-selection.execution';
import { CalculateNodeMoveRestrictionsExecution } from './domain/calculate-node-move-restrictions';
import { PutInputConnectionHandlersToArrayExecution } from './domain/put-input-connection-handlers-to-array';
import { PutOutputConnectionHandlersToArrayExecution } from './domain/put-output-connection-handlers-to-array';
import { CalculateCommonNodeMoveRestrictionsExecution } from './domain/calculate-common-node-move-restrictions';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [

  CalculateCommonNodeMoveRestrictionsExecution,

  CalculateNodeMoveRestrictionsExecution,

  PutInputConnectionHandlersToArrayExecution,

  PutOutputConnectionHandlersToArrayExecution,

  CreateMoveNodesDragModelFromSelectionExecution,
];
