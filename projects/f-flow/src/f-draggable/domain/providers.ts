import { IsArrayHasParentNodeExecution } from './is-array-has-parent-node';
import { GetNormalizedParentNodeRectExecution } from './get-normalized-parent-node-rect';
import { DetectConnectionsUnderDragNode } from './detect-connections-under-drag-node';
import { EmitStartDragSequenceEvent } from './emit-start-drag-sequence-event';
import { EmitEndDragSequenceEvent } from './emit-end-drag-sequence-event';
import { EmitSelectionChangeEvent } from './emit-selection-change-event';

export const DRAG_AND_DROP_COMMON_PROVIDERS = [
  EmitStartDragSequenceEvent,
  EmitEndDragSequenceEvent,
  EmitSelectionChangeEvent,

  GetNormalizedParentNodeRectExecution,

  IsArrayHasParentNodeExecution,

  DetectConnectionsUnderDragNode,
];
