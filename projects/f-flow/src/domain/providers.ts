import {GetNormalizedElementRectExecution} from './get-normalized-element-rect';
import {
  MoveFrontElementsBeforeTargetElementExecution,
  UpdateItemAndChildrenLayersExecution
} from './update-item-and-children-layers';
import {GetNormalizedPointExecution} from './get-normalized-point';
import {SortItemLayersExecution, SortItemsByParentExecution, SortNodeLayersExecution} from './sort-item-layers';
import {GetDeepChildrenNodesAndGroupsExecution} from './get-deep-children-nodes-and-groups';
import {GetElementRoundedRectExecution} from './get-element-rounded-rect';
import {F_SELECTION_FEATURES} from './f-selection';
import {F_BACKGROUND_FEATURES} from './f-background';
import {F_CANVAS_FEATURES} from './f-canvas';
import {F_CONNECTION_FEATURES} from './f-connection';
import {F_CONNECTORS_FEATURES} from './f-connectors';
import {F_FLOW_FEATURES} from './f-flow';
import {F_DRAGGABLE_FEATURES} from './f-draggable';
import {F_NODE_FEATURES} from './f-node';
import {F_LINE_ALIGNMENT_FEATURES} from './f-line-alignment';
import {F_ZOOM_FEATURES} from './f-zoom';
import {GetNormalizedConnectorRectExecution} from "./get-normalized-connector-rect";

export const COMMON_PROVIDERS = [

  ...F_CANVAS_FEATURES,

  ...F_CONNECTION_FEATURES,

  ...F_BACKGROUND_FEATURES,

  ...F_CONNECTORS_FEATURES,

  ...F_DRAGGABLE_FEATURES,

  ...F_FLOW_FEATURES,

  ...F_LINE_ALIGNMENT_FEATURES,

  ...F_NODE_FEATURES,

  GetElementRoundedRectExecution,

  ...F_SELECTION_FEATURES,

  ...F_ZOOM_FEATURES,

  GetDeepChildrenNodesAndGroupsExecution,

  GetNormalizedConnectorRectExecution,

  GetNormalizedElementRectExecution,

  GetNormalizedPointExecution,

  SortItemLayersExecution,

  SortItemsByParentExecution,

  SortNodeLayersExecution,

  UpdateItemAndChildrenLayersExecution,

  MoveFrontElementsBeforeTargetElementExecution,
];
