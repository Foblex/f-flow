import { GetConnectionLineExecution } from './get-connection-line';
import { RedrawConnectionsExecution } from './redraw-connections';
import { GetNodesRectExecution } from './get-nodes-rect';
import { GetElementRectInFlowExecution } from './get-element-rect-in-flow';
import {
  MoveFrontElementsBeforeTargetElementExecution,
  UpdateItemAndChildrenLayersExecution
} from './update-item-and-children-layers';
import { GetPositionInFlowExecution } from './get-position-in-flow';
import { CreateConnectionMarkersExecution } from './create-connection-markers';
import { GetCanBeSelectedItemsExecution } from './get-can-be-selected-items';
import { IsConnectionUnderNodeExecution } from './is-connection-under-node';
import { GetScaledNodeRectsWithFlowPositionExecution } from './get-scaled-node-rects-with-flow-position';
import { EmitTransformChangesExecution } from './emit-transform-changes';
import { SubscribeOnTransformChangesExecution } from './subscribe-on-transform-changes';
import { SortItemLayersExecution, SortItemsByParentExecution, SortNodeLayersExecution } from './sort-item-layers';
import { GetDeepChildrenNodesAndGroupsExecution } from './get-deep-children-nodes-and-groups';
import { CreateRoundedRectFromElementExecution } from './create-rounded-rect-from-element';
import { GET_FLOW_STATE_PROVIDERS } from './get-flow-state';
import { ShowConnectionsAfterCalculationsExecution } from './show-connections-after-calculations';
import { F_SELECTION_FEATURES } from './f-selection/providers';
import { F_CANVAS_FEATURES } from '../f-canvas';
import { F_BACKGROUND_FEATURES } from '../f-backgroud/domain/providers';

export const COMMON_PROVIDERS = [

  ...F_CANVAS_FEATURES,

  ...F_BACKGROUND_FEATURES,

  CreateConnectionMarkersExecution,

  CreateRoundedRectFromElementExecution,

  EmitTransformChangesExecution,

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

  RedrawConnectionsExecution,

  ShowConnectionsAfterCalculationsExecution,

  SortItemLayersExecution,

  SortItemsByParentExecution,

  SortNodeLayersExecution,

  SubscribeOnTransformChangesExecution,

  UpdateItemAndChildrenLayersExecution,

  MoveFrontElementsBeforeTargetElementExecution,
];
