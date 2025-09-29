import { AddNodeToStore } from './add-node-to-store';
import { RemoveNodeFromStore } from './remove-node-from-store';
import { UpdateNodeWhenStateOrSizeChanged } from './update-node-when-state-or-size-changed';
import { GetNodes } from './get-nodes';
import { CalculateNodesBoundingBox } from './calculate-nodes-bounding-box';
import { CalculateNodesBoundingBoxNormalizedPosition } from './calculate-nodes-bounding-box-normalized-position';
import { GetNodePadding } from './get-node-padding';
import { GetParentNodes } from './get-parent-nodes';
import { CalculateInputConnections } from './calculate-input-connections';
import { CalculateOutputConnections } from './calculate-output-connections';
import { GetChildNodeIds } from './get-child-node-ids';
import { FitToChildNodesAndGroups } from './fit-to-child-nodes-and-groups';
import {
  CalculateConnectableSideByConnectedPositions,
  CalculateConnectableSideByInternalPosition,
  CalculateNodeConnectorsConnectableSides,
} from './calculate-node-connectors-connectable-sides';

/**
 * This file exports all the node-related executions that can be used in the F-Flow domain.
 */
export const F_NODE_FEATURES = [
  AddNodeToStore,

  CalculateConnectableSideByConnectedPositions,

  CalculateConnectableSideByInternalPosition,

  CalculateInputConnections,

  CalculateNodeConnectorsConnectableSides,

  CalculateNodesBoundingBox,

  CalculateNodesBoundingBoxNormalizedPosition,

  CalculateOutputConnections,

  FitToChildNodesAndGroups,

  GetChildNodeIds,

  GetNodePadding,

  GetNodes,

  GetParentNodes,

  UpdateNodeWhenStateOrSizeChanged,

  RemoveNodeFromStore,
];
