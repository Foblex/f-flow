import { AddNodeToStoreExecution } from './add-node-to-store';
import { RemoveNodeFromStoreExecution } from './remove-node-from-store';
import { UpdateNodeWhenStateOrSizeChangedExecution } from './update-node-when-state-or-size-changed';
import { GetNodesExecution } from './get-nodes';
import { CalculateNodesBoundingBoxExecution } from './calculate-nodes-bounding-box';
import {
  CalculateNodesBoundingBoxNormalizedPositionExecution
} from './calculate-nodes-bounding-box-normalized-position';

export const F_NODE_FEATURES = [

  AddNodeToStoreExecution,

  CalculateNodesBoundingBoxExecution,

  CalculateNodesBoundingBoxNormalizedPositionExecution,

  GetNodesExecution,

  UpdateNodeWhenStateOrSizeChangedExecution,

  RemoveNodeFromStoreExecution
];
