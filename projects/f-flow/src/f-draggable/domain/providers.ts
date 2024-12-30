import { GetNormalizedNodeRectExecution } from './get-normalized-node-rect';
import { GetParentNodesExecution } from './get-parent-nodes';
import { IsArrayHasParentNodeExecution } from './is-array-has-parent-node';
import { GetNormalizedParentNodeRectExecution } from './get-normalized-parent-node-rect';
import { GetNodePaddingExecution } from './get-node-padding';
import { IsConnectionUnderNodeExecution, IsConnectionUnderNodeValidator } from './is-connection-under-node';

export const DRAG_AND_DROP_COMMON_PROVIDERS = [

  GetNodePaddingExecution,

  GetNormalizedNodeRectExecution,

  GetNormalizedParentNodeRectExecution,

  GetParentNodesExecution,

  IsArrayHasParentNodeExecution,

  IsConnectionUnderNodeExecution,
  IsConnectionUnderNodeValidator,
];
