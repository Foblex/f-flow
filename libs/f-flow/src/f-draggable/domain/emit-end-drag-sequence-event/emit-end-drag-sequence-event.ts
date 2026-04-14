import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EmitEndDragSequenceEventRequest } from './emit-end-drag-sequence-event-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { F_CSS_CLASS } from '../../../domain';

/**
 * Execution that handles the end of a drag sequence.
 */
@Injectable()
@FExecutionRegister(EmitEndDragSequenceEventRequest)
export class EmitEndDragSequenceEvent implements IExecution<EmitEndDragSequenceEventRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: EmitEndDragSequenceEventRequest): void {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);

    this._dragSession.reset();
    this._emitEvent();
  }

  private _emitEvent(): void {
    this._store.fDraggable?.fDragEnded?.emit();
  }
}
