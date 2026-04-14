import { AddDndToStore } from './add-dnd-to-store';
import { RemoveDndFromStore } from './remove-dnd-from-store';
import { PrepareDragSequence } from './prepare-drag-sequence';
import { InitializeDragSequence } from './initialize-drag-sequence';
import { OnPointerMove } from './on-pointer-move';
import { IsDragStarted } from './is-drag-started';

/**
 * Collection of all FDraggable feature executions.
 */
export const F_DRAGGABLE_FEATURES = [
  AddDndToStore,

  OnPointerMove,

  InitializeDragSequence,

  PrepareDragSequence,

  IsDragStarted,

  RemoveDndFromStore,
];
