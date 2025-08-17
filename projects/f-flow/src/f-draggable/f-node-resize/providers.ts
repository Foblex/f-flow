import { FNodeResizeFinalizeExecution } from './resize-finalize';
import { NodeResizePreparation } from './resize-preparation';
import { CalculateResizeLimits } from './calculate-resize-limits';
import { ApplyChildResizeConstraints } from './apply-child-resize-constraints';
import { ApplyParentResizeConstraints } from './apply-parent-resize-constraints';
import { CalculateChangedRectFromDifference } from './calculate-changed-rect-from-difference';
import { GetNormalizedChildrenNodesRectExecution } from './get-normalized-children-nodes-rect';

export const NODE_RESIZE_PROVIDERS = [

  ApplyChildResizeConstraints,

  ApplyParentResizeConstraints,

  CalculateChangedRectFromDifference,

  GetNormalizedChildrenNodesRectExecution,

  CalculateResizeLimits,

  FNodeResizeFinalizeExecution,

  NodeResizePreparation,
];
