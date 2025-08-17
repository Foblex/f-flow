import { NodeResizeFinalize } from './resize-finalize';
import { NodeResizePreparation } from './resize-preparation';
import { CalculateResizeLimits } from './calculate-resize-limits';
import { ApplyChildResizeConstraints } from './apply-child-resize-constraints';
import { ApplyParentResizeConstraints } from './apply-parent-resize-constraints';
import { CalculateChangedRectFromDifference } from './calculate-changed-rect-from-difference';
import { CalculateDirectChildrenUnionRect } from './calculate-direct-children-union-rect';

export const NODE_RESIZE_PROVIDERS = [

  ApplyChildResizeConstraints,

  ApplyParentResizeConstraints,

  CalculateChangedRectFromDifference,

  CalculateDirectChildrenUnionRect,

  CalculateResizeLimits,

  NodeResizeFinalize,

  NodeResizePreparation,
];
