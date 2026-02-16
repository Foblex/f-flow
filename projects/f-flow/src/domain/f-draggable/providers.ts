import { AddDndToStoreExecution } from './add-dnd-to-store';
import { RemoveDndFromStoreExecution } from './remove-dnd-from-store';
import { PrepareDragSequenceExecution } from './prepare-drag-sequence';
import { InitializeDragSequenceExecution } from './initialize-drag-sequence';
import { OnPointerMoveExecution } from './on-pointer-move';
import { IsDragStarted } from './is-drag-started';

/**
 * Collection of all FDraggable feature executions.
 */
export const F_DRAGGABLE_FEATURES = [
  AddDndToStoreExecution,

  OnPointerMoveExecution,

  InitializeDragSequenceExecution,

  PrepareDragSequenceExecution,

  IsDragStarted,

  RemoveDndFromStoreExecution,
];
