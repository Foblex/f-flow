import { GetChildrenNodesExecution } from './get-children-nodes';
import { GetNormalizedNodeRectExecution } from './get-normalized-node-rect';
import { ConvertComputedToPixelsExecution } from './convert-computed-to-pixels';
import { GetParentNodesExecution } from './get-parent-nodes';
import { IsArrayHasParentNodeExecution } from './is-array-has-parent-node';
import { GetNormalizedParentNodeRectExecution } from './get-normalized-parent-node-rect';
import { GetNodePaddingExecution } from './get-node-padding';

export const DRAG_AND_DROP_COMMON_PROVIDERS = [

  ConvertComputedToPixelsExecution,

  GetChildrenNodesExecution,

  GetNodePaddingExecution,

  GetNormalizedNodeRectExecution,

  GetNormalizedParentNodeRectExecution,

  GetParentNodesExecution,

  IsArrayHasParentNodeExecution
];
