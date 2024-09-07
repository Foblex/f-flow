import { GetConnectionLineExecution } from './get-connection-line';
import { RedrawConnectionsExecution } from './redraw-connections';
import { GetOutputRectInFlowExecution } from './get-output-rect-in-flow';
import { GetSelectionExecution } from './get-selection';
import { SelectAllExecution } from './select-all';
import { ClearSelectionExecution } from './clear-selection';
import { GetNodesRectExecution } from './get-nodes-rect';
import { GetElementRectInFlowExecution } from './get-element-rect-in-flow';
import { GetInputRectInFlowExecution } from './get-input-rect-in-flow';
import { SelectExecution } from './select';
import {
  MoveFrontElementsBeforeTargetElementExecution,
  UpdateItemAndChildrenLayersExecution
} from './update-item-and-children-layers';
import { GetPositionInFlowExecution } from './get-position-in-flow';
import { CreateConnectionMarkersExecution } from './create-connection-markers';
import { GetCanBeSelectedItemsExecution } from './get-can-be-selected-items';
import { IsConnectionUnderNodeExecution } from './is-connection-under-node';
import { SelectAndUpdateNodeLayerExecution } from './select-and-update-node-layer';
import { GetScaledNodeRectsWithFlowPositionExecution } from './get-scaled-node-rects-with-flow-position';
import { EmitTransformChangesExecution } from './emit-transform-changes';
import { SubscribeOnTransformChangesExecution } from './subscribe-on-transform-changes';
import { SortItemLayersExecution, SortItemsByParentExecution, SortNodeLayersExecution } from './sort-item-layers';
import { GetDeepChildrenNodesAndGroupsExecution } from './get-deep-children-nodes-and-groups';

export const COMMON_PROVIDERS = [

  ClearSelectionExecution,

  CreateConnectionMarkersExecution,

  EmitTransformChangesExecution,

  GetCanBeSelectedItemsExecution,

  GetDeepChildrenNodesAndGroupsExecution,

  GetConnectionLineExecution,

  GetElementRectInFlowExecution,

  GetScaledNodeRectsWithFlowPositionExecution,

  GetNodesRectExecution,

  GetOutputRectInFlowExecution,

  GetPositionInFlowExecution,

  GetSelectionExecution,

  IsConnectionUnderNodeExecution,

  RedrawConnectionsExecution,

  SelectExecution,

  SelectAllExecution,

  SelectAndUpdateNodeLayerExecution,

  SortItemLayersExecution,

  SortItemsByParentExecution,

  SortNodeLayersExecution,

  SubscribeOnTransformChangesExecution,

  UpdateItemAndChildrenLayersExecution,

  MoveFrontElementsBeforeTargetElementExecution,

  GetInputRectInFlowExecution,
];
