import { AddDndToStoreExecution } from './add-dnd-to-store';
import { EmitSelectionChangeEventExecution } from './emit-selection-change-event';
import { RemoveDndFromStoreExecution } from './remove-dnd-from-store';
import { PrepareDragSequenceExecution } from './prepare-drag-sequence';
import { EndDragSequenceExecution } from './end-drag-sequence';
import { InitializeDragSequenceExecution } from './initialize-drag-sequence';
import { OnPointerMoveExecution } from './on-pointer-move';
import { IsDragStarted } from './is-drag-started';
import { StartDragSequenceExecution } from './start-drag-sequence';

/**
 * Collection of all FDraggable feature executions.
 */
export const F_DRAGGABLE_FEATURES = [

  AddDndToStoreExecution,

  EmitSelectionChangeEventExecution,

  EndDragSequenceExecution,

  OnPointerMoveExecution,

  InitializeDragSequenceExecution,

  PrepareDragSequenceExecution,

  IsDragStarted,

  StartDragSequenceExecution,

  RemoveDndFromStoreExecution,
];
