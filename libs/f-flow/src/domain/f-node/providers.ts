import { AddNodeToStore } from './add-node-to-store';
import { RemoveNodeFromStore } from './remove-node-from-store';
import { UpdateNodeWhenStateOrSizeChanged } from './update-node-when-state-or-size-changed';
import { CalculateNodesBoundingBox } from './calculate-nodes-bounding-box';
import { CalculateNodesBoundingBoxNormalizedPosition } from './calculate-nodes-bounding-box-normalized-position';
import { GetNodePadding } from './get-node-padding';
import { GetParentNodes } from './get-parent-nodes';
import { CalculateInputConnections } from './calculate-input-connections';
import { CalculateOutputConnections } from './calculate-output-connections';
import { GetChildNodeIds } from './get-child-node-ids';
import { FitToChildNodesAndGroups } from './fit-to-child-nodes-and-groups';
import { fExecution } from '../../_libs/f-mediator';
import { AddNodeToStoreRequest } from './add-node-to-store/add-node-to-store-request';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectors-connectable-sides/calculate-connectable-side-by-connected-positions/calculate-connectable-side-by-connected-positions-request';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectors-connectable-sides/calculate-connectable-side-by-internal-position/calculate-connectable-side-by-internal-position-request';
import { CalculateConnectorsConnectableSidesRequest } from './calculate-connectors-connectable-sides/calculate-connectors-connectable-sides-request';
import { CalculateInputConnectionsRequest } from './calculate-input-connections/calculate-input-connections-request';
import { CalculateNodesBoundingBoxNormalizedPositionRequest } from './calculate-nodes-bounding-box-normalized-position/calculate-nodes-bounding-box-normalized-position-request';
import { CalculateNodesBoundingBoxRequest } from './calculate-nodes-bounding-box/calculate-nodes-bounding-box-request';
import { CalculateOutputConnectionsRequest } from './calculate-output-connections/calculate-output-connections-request';
import { FitToChildNodesAndGroupsRequest } from './fit-to-child-nodes-and-groups/fit-to-child-nodes-and-groups-request';
import { GetChildNodeIdsRequest } from './get-child-node-ids/get-child-node-ids-request';
import { GetNodePaddingRequest } from './get-node-padding/get-node-padding-request';
import { GetParentNodesRequest } from './get-parent-nodes/get-parent-nodes-request';
import { RemoveNodeFromStoreRequest } from './remove-node-from-store/remove-node-from-store-request';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed/update-node-when-state-or-size-changed-request';
import {
  CalculateConnectableSideByConnectedPositions,
  CalculateConnectableSideByInternalPosition,
  CalculateConnectorsConnectableSides,
  ConnectableSidesScheduler,
} from './calculate-connectors-connectable-sides';

/**
 * This file exports all the node-related executions that can be used in the F-Flow domain.
 */
export const F_NODE_FEATURES = [
  fExecution(AddNodeToStoreRequest, AddNodeToStore),

  fExecution(
    CalculateConnectableSideByConnectedPositionsRequest,
    CalculateConnectableSideByConnectedPositions,
  ),

  fExecution(
    CalculateConnectableSideByInternalPositionRequest,
    CalculateConnectableSideByInternalPosition,
  ),

  fExecution(CalculateInputConnectionsRequest, CalculateInputConnections),

  fExecution(CalculateConnectorsConnectableSidesRequest, CalculateConnectorsConnectableSides),

  ConnectableSidesScheduler,

  fExecution(CalculateNodesBoundingBoxRequest, CalculateNodesBoundingBox),

  fExecution(
    CalculateNodesBoundingBoxNormalizedPositionRequest,
    CalculateNodesBoundingBoxNormalizedPosition,
  ),

  fExecution(CalculateOutputConnectionsRequest, CalculateOutputConnections),

  fExecution(FitToChildNodesAndGroupsRequest, FitToChildNodesAndGroups),

  fExecution(GetChildNodeIdsRequest, GetChildNodeIds),

  fExecution(GetNodePaddingRequest, GetNodePadding),

  fExecution(GetParentNodesRequest, GetParentNodes),

  fExecution(UpdateNodeWhenStateOrSizeChangedRequest, UpdateNodeWhenStateOrSizeChanged),

  fExecution(RemoveNodeFromStoreRequest, RemoveNodeFromStore),
];
