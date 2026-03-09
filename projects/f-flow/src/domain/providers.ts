import { GetNormalizedElementRect } from './get-normalized-element-rect';
import {
  MoveFrontElementsBeforeTargetElement,
  UpdateItemAndChildrenLayers,
} from './update-item-and-children-layers';
import { GetNormalizedPoint } from './get-normalized-point';
import { SortItemLayers, SortItemsByParent, SortNodeLayers } from './sort-item-layers';
import { GetDeepChildrenNodesAndGroups } from './get-deep-children-nodes-and-groups';
import { F_SELECTION_FEATURES } from './f-selection';
import { F_BACKGROUND_FEATURES } from './f-background';
import { F_CANVAS_FEATURES } from './f-canvas';
import { F_CONNECTION_FEATURES } from './f-connection';
import { F_CONNECTORS_FEATURES } from './f-connectors';
import { F_FLOW_FEATURES } from './f-flow';
import { F_DRAGGABLE_FEATURES } from './f-draggable';
import { F_NODE_FEATURES } from './f-node';
import { F_ZOOM_FEATURES } from './f-zoom';
import { GetNormalizedConnectorRect } from './get-normalized-connector-rect';
import { F_MINIMAP_FEATURES } from './minimap';
import { F_CACHE_FEATURES } from '../f-cache';

/**
 * This module provides a collection of common providers for the FFlow domain.
 * It includes features related to canvas, connections, background, connectors,
 * draggable elements, flow, line alignment, nodes, selection, zoom,
 * and various utility executions.
 */
export const COMMON_PROVIDERS = [
  ...F_CANVAS_FEATURES,

  ...F_CONNECTION_FEATURES,

  ...F_BACKGROUND_FEATURES,

  ...F_CONNECTORS_FEATURES,

  ...F_DRAGGABLE_FEATURES,

  ...F_FLOW_FEATURES,

  ...F_NODE_FEATURES,

  ...F_SELECTION_FEATURES,

  ...F_ZOOM_FEATURES,

  ...F_MINIMAP_FEATURES,

  ...F_CACHE_FEATURES,

  GetDeepChildrenNodesAndGroups,

  GetNormalizedConnectorRect,

  GetNormalizedElementRect,

  GetNormalizedPoint,

  SortItemLayers,

  SortItemsByParent,

  SortNodeLayers,

  UpdateItemAndChildrenLayers,

  MoveFrontElementsBeforeTargetElement,
];
