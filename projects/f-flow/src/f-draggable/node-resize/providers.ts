import { NODE_RESIZE_FINALIZE_PROVIDERS } from './node-resize-finalize';
import { NODE_RESIZE_PREPARATION_PROVIDERS } from './node-resize-preparation';
import { GetNodeResizeRestrictionsExecution } from './get-node-resize-restrictions';
import { ApplyChildResizeRestrictionsExecution } from './apply-child-resize-restrictions';
import { ApplyParentResizeRestrictionsExecution } from './apply-parent-resize-restrictions';
import { CalculateChangedSizeExecution } from './calculate-changed-size';
import { CalculateChangedPositionExecution } from './calculate-changed-position';
import { GetNormalizedChildrenNodesRectExecution } from './get-normalized-children-nodes-rect';

export const NODE_RESIZE_PROVIDERS = [

  ApplyChildResizeRestrictionsExecution,

  ApplyParentResizeRestrictionsExecution,

  CalculateChangedPositionExecution,

  CalculateChangedSizeExecution,

  GetNormalizedChildrenNodesRectExecution,

  GetNodeResizeRestrictionsExecution,

  ...NODE_RESIZE_FINALIZE_PROVIDERS,

  ...NODE_RESIZE_PREPARATION_PROVIDERS,
];
