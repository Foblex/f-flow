import { IsArrayHasParentNode } from './is-array-has-parent-node';
import { GetNormalizedParentNodeRect } from './get-normalized-parent-node-rect';
import { DetectConnectionsUnderDragNode } from './detect-connections-under-drag-node';
import { EmitStartDragSequenceEvent } from './emit-start-drag-sequence-event';
import { EmitEndDragSequenceEvent } from './emit-end-drag-sequence-event';
import { EmitSelectionChangeEvent } from './emit-selection-change-event';
import { fExecution } from '../../_libs/f-mediator';
import { DetectConnectionsUnderDragNodeRequest } from './detect-connections-under-drag-node/detect-connections-under-drag-node-request';
import { EmitEndDragSequenceEventRequest } from './emit-end-drag-sequence-event/emit-end-drag-sequence-event-request';
import { EmitSelectionChangeEventRequest } from './emit-selection-change-event/emit-selection-change-event-request';
import { EmitStartDragSequenceEventRequest } from './emit-start-drag-sequence-event/emit-start-drag-sequence-event-request';
import { GetNormalizedParentNodeRectRequest } from './get-normalized-parent-node-rect/get-normalized-parent-node-rect-request';
import { IsArrayHasParentNodeRequest } from './is-array-has-parent-node/is-array-has-parent-node-request';

export const DRAG_AND_DROP_COMMON_PROVIDERS = [
  fExecution(EmitStartDragSequenceEventRequest, EmitStartDragSequenceEvent),

  fExecution(EmitEndDragSequenceEventRequest, EmitEndDragSequenceEvent),

  fExecution(EmitSelectionChangeEventRequest, EmitSelectionChangeEvent),

  fExecution(GetNormalizedParentNodeRectRequest, GetNormalizedParentNodeRect),

  fExecution(IsArrayHasParentNodeRequest, IsArrayHasParentNode),

  fExecution(DetectConnectionsUnderDragNodeRequest, DetectConnectionsUnderDragNode),
];
