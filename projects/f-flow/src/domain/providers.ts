import { GetConnectionLineExecution } from './get-connection-line';
import { GetNodesRectExecution } from './get-nodes-rect';
import { GetElementRectInFlowExecution } from './get-element-rect-in-flow';
import {
  MoveFrontElementsBeforeTargetElementExecution,
  UpdateItemAndChildrenLayersExecution
} from './update-item-and-children-layers';
import { GetPositionInFlowExecution } from './get-position-in-flow';
import { GetCanBeSelectedItemsExecution } from './get-can-be-selected-items';
import { IsConnectionUnderNodeExecution } from './is-connection-under-node';
import { GetScaledNodeRectsWithFlowPositionExecution } from './get-scaled-node-rects-with-flow-position';
import { SortItemLayersExecution, SortItemsByParentExecution, SortNodeLayersExecution } from './sort-item-layers';
import { GetDeepChildrenNodesAndGroupsExecution } from './get-deep-children-nodes-and-groups';
import { CreateRoundedRectFromElementExecution } from './create-rounded-rect-from-element';
import { GET_FLOW_STATE_PROVIDERS } from './get-flow-state';
import { F_SELECTION_FEATURES } from './f-selection';
import { F_BACKGROUND_FEATURES } from './f-background';
import { F_CANVAS_FEATURES } from './f-canvas';
import { F_CONNECTION_FEATURES } from './f-connection';
import { F_CONNECTORS_FEATURES } from './f-connectors';
import { F_FLOW_FEATURES } from './f-flow';
import { F_DRAGGABLE_FEATURES } from './f-draggable';
import { F_NODE_FEATURES } from './f-node';

export const COMMON_PROVIDERS = [

  ...F_CANVAS_FEATURES,

  ...F_CONNECTION_FEATURES,

  ...F_BACKGROUND_FEATURES,

  ...F_CONNECTORS_FEATURES,

  ...F_DRAGGABLE_FEATURES,

  ...F_FLOW_FEATURES,

  ...F_NODE_FEATURES,

  CreateRoundedRectFromElementExecution,

  ...F_SELECTION_FEATURES,

  GetCanBeSelectedItemsExecution,

  GetDeepChildrenNodesAndGroupsExecution,

  GetConnectionLineExecution,

  GetElementRectInFlowExecution,

  ...GET_FLOW_STATE_PROVIDERS,

  GetScaledNodeRectsWithFlowPositionExecution,

  GetNodesRectExecution,

  GetPositionInFlowExecution,

  IsConnectionUnderNodeExecution,

  SortItemLayersExecution,

  SortItemsByParentExecution,

  SortNodeLayersExecution,

  UpdateItemAndChildrenLayersExecution,

  MoveFrontElementsBeforeTargetElementExecution,
];
