import { CreateMoveNodesDragModelFromSelectionExecution } from './create-move-nodes-drag-model-from-selection.execution';
import { GetNodeMoveRestrictionsExecution } from './domain/get-node-move-restrictions';
import { PutInputConnectionHandlersToArrayExecution } from './domain/put-input-connection-handlers-to-array';
import { PutOutputConnectionHandlersToArrayExecution } from './domain/put-output-connection-handlers-to-array';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [

  GetNodeMoveRestrictionsExecution,

  PutInputConnectionHandlersToArrayExecution,

  PutOutputConnectionHandlersToArrayExecution,

  CreateMoveNodesDragModelFromSelectionExecution,
];
