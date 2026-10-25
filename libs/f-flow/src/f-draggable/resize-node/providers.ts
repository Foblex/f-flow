import { ResizeNodeFinalize } from './resize-node-finalize';
import { ResizeNodePreparation } from './resize-preparation';
import { CalculateResizeLimits } from './calculate-resize-limits';
import { ApplyChildResizeConstraints } from './apply-child-resize-constraints';
import { ApplyParentResizeConstraints } from './apply-parent-resize-constraints';
import { CalculateChangedRectFromDifference } from './calculate-changed-rect-from-difference';
import { CalculateDirectChildrenUnionRect } from './calculate-direct-children-union-rect';
import { AttachResizeConnectionDragHandlersToNode } from './resize-preparation';
import { fExecution } from '../../_libs/f-mediator';
import { ApplyChildResizeConstraintsRequest } from './apply-child-resize-constraints/apply-child-resize-constraints-request';
import { ApplyParentResizeConstraintsRequest } from './apply-parent-resize-constraints/apply-parent-resize-constraints-request';
import { AttachResizeConnectionDragHandlersToNodeRequest } from './resize-preparation/attach-resize-connection-drag-handlers-to-node/attach-resize-connection-drag-handlers-to-node-request';
import { CalculateChangedRectFromDifferenceRequest } from './calculate-changed-rect-from-difference/calculate-changed-rect-from-difference-request';
import { CalculateDirectChildrenUnionRectRequest } from './calculate-direct-children-union-rect/calculate-direct-children-union-rect-request';
import { CalculateResizeLimitsRequest } from './calculate-resize-limits/calculate-resize-limits-request';
import { ResizeNodeFinalizeRequest } from './resize-node-finalize/resize-node-finalize-request';
import { ResizeNodePreparationRequest } from './resize-preparation/resize-node-preparation-request';

export const NODE_RESIZE_PROVIDERS = [
  fExecution(ApplyChildResizeConstraintsRequest, ApplyChildResizeConstraints),

  fExecution(ApplyParentResizeConstraintsRequest, ApplyParentResizeConstraints),

  fExecution(CalculateChangedRectFromDifferenceRequest, CalculateChangedRectFromDifference),

  fExecution(CalculateDirectChildrenUnionRectRequest, CalculateDirectChildrenUnionRect),

  fExecution(CalculateResizeLimitsRequest, CalculateResizeLimits),

  fExecution(
    AttachResizeConnectionDragHandlersToNodeRequest,
    AttachResizeConnectionDragHandlersToNode,
  ),

  fExecution(ResizeNodeFinalizeRequest, ResizeNodeFinalize),

  fExecution(ResizeNodePreparationRequest, ResizeNodePreparation),
];
