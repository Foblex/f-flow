import { IsArrayHasParentNodeExecution } from './is-array-has-parent-node';
import { GetNormalizedParentNodeRectExecution } from './get-normalized-parent-node-rect';
import { IsConnectionUnderNodeExecution } from './is-connection-under-node';

export const DRAG_AND_DROP_COMMON_PROVIDERS = [

  GetNormalizedParentNodeRectExecution,

  IsArrayHasParentNodeExecution,

  IsConnectionUnderNodeExecution,
];
