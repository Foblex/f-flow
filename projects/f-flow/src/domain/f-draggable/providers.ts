import { AddDndToStoreExecution } from './add-dnd-to-store';
import { EmitSelectionChangeEventExecution } from './emit-selection-change-event';
import { RemoveDndFromStoreExecution } from './remove-dnd-from-store';
import { StartDragSequenceExecution } from './start-drag-sequence';
import { EndDragSequenceExecution } from './end-drag-sequence';
import { InitializeDragSequenceExecution } from './initialize-drag-sequence';
import { HandleDragSequenceExecution } from './handle-drag-sequence';
import { IsDragStartedExecution } from './is-drag-started';

export const F_DRAGGABLE_FEATURES = [

  AddDndToStoreExecution,

  EmitSelectionChangeEventExecution,

  EndDragSequenceExecution,

  HandleDragSequenceExecution,

  InitializeDragSequenceExecution,

  IsDragStartedExecution,

  StartDragSequenceExecution,

  RemoveDndFromStoreExecution
];
