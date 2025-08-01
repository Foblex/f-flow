import { AddNodeToStoreExecution } from './add-node-to-store';
import { RemoveNodeFromStoreExecution } from './remove-node-from-store';
import { UpdateNodeWhenStateOrSizeChangedExecution } from './update-node-when-state-or-size-changed';
import { GetNodesExecution } from './get-nodes';
import { CalculateNodesBoundingBoxExecution } from './calculate-nodes-bounding-box';
import {
  CalculateNodesBoundingBoxNormalizedPositionExecution
} from './calculate-nodes-bounding-box-normalized-position';
import { GetNodePaddingExecution } from './get-node-padding';
import { GetParentNodesExecution } from './get-parent-nodes';
import { CalculateInputConnectionsExecution } from './calculate-input-connections';
import { CalculateOutputConnectionsExecution } from './calculate-output-connections';

/**
 * This file exports all the node-related executions that can be used in the F-Flow domain.
 */
export const F_NODE_FEATURES = [

  AddNodeToStoreExecution,

  CalculateInputConnectionsExecution,

  CalculateNodesBoundingBoxExecution,

  CalculateNodesBoundingBoxNormalizedPositionExecution,

  CalculateOutputConnectionsExecution,

  GetNodePaddingExecution,

  GetNodesExecution,

  GetParentNodesExecution,

  UpdateNodeWhenStateOrSizeChangedExecution,

  RemoveNodeFromStoreExecution
];
