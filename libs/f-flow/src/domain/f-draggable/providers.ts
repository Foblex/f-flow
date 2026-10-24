import { AddDndToStore } from './add-dnd-to-store';
import { RemoveDndFromStore } from './remove-dnd-from-store';
import { PrepareDragSequence } from './prepare-drag-sequence';
import { InitializeDragSequence } from './initialize-drag-sequence';
import { OnPointerMove } from './on-pointer-move';
import { IsDragStarted } from './is-drag-started';
import { fExecution } from '../../_libs/f-mediator';
import { AddDndToStoreRequest } from './add-dnd-to-store/add-dnd-to-store-request';
import { InitializeDragSequenceRequest } from './initialize-drag-sequence/initialize-drag-sequence-request';
import { IsDragStartedRequest } from './is-drag-started/is-drag-started-request';
import { OnPointerMoveRequest } from './on-pointer-move/on-pointer-move-request';
import { PrepareDragSequenceRequest } from './prepare-drag-sequence/prepare-drag-sequence-request';
import { RemoveDndFromStoreRequest } from './remove-dnd-from-store/remove-dnd-from-store-request';

/**
 * Collection of all FDraggable feature executions.
 */
export const F_DRAGGABLE_FEATURES = [
  fExecution(AddDndToStoreRequest, AddDndToStore),

  fExecution(OnPointerMoveRequest, OnPointerMove),

  fExecution(InitializeDragSequenceRequest, InitializeDragSequence),

  fExecution(PrepareDragSequenceRequest, PrepareDragSequence),

  fExecution(IsDragStartedRequest, IsDragStarted),

  fExecution(RemoveDndFromStoreRequest, RemoveDndFromStore),
];
