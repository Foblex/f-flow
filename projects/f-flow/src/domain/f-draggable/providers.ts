import { AddDndToStoreExecution } from './add-dnd-to-store';
import { EmitSelectionChangeEventExecution } from './emit-selection-change-event';
import { RemoveDndFromStoreExecution } from './remove-dnd-from-store';
import { PrepareDragSequenceExecution } from './prepare-drag-sequence';
import { EndDragSequenceExecution } from './end-drag-sequence';
import { InitializeDragSequenceExecution } from './initialize-drag-sequence';
import { OnPointerMoveExecution } from './on-pointer-move';
import { IsDragStartedExecution } from './is-drag-started';
import { StartDragSequenceExecution } from './start-drag-sequence';

export const F_DRAGGABLE_FEATURES = [

  AddDndToStoreExecution,

  EmitSelectionChangeEventExecution,

  EndDragSequenceExecution,

  OnPointerMoveExecution,

  InitializeDragSequenceExecution,

  PrepareDragSequenceExecution,

  IsDragStartedExecution,

  StartDragSequenceExecution,

  RemoveDndFromStoreExecution
];
