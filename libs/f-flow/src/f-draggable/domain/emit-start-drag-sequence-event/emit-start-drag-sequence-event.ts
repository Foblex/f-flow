import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { EmitStartDragSequenceEventRequest } from './emit-start-drag-sequence-event-request';
import { FComponentsStore } from '../../../f-storage';
import {
  EmitSelectionChangeEventRequest,
  FDraggableDataContext,
  FDragStartedEvent,
} from '../../../f-draggable';
import { F_CSS_CLASS } from '../../../domain';

/**
 * Execution that starts the drag sequence by adding a dragging class to the host element
 */
@Injectable()
@FExecutionRegister(EmitStartDragSequenceEventRequest)
export class EmitStartDragSequenceEvent
  implements IExecution<EmitStartDragSequenceEventRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: EmitStartDragSequenceEventRequest): void {
    if (this._dragContext.draggableItems.length > 0) {
      this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
      this._mediator.execute<void>(new EmitSelectionChangeEventRequest());
      this._emitDragStarted();
    }
  }

  private _emitDragStarted(): void {
    const event = this._dragContext.draggableItems[0].getEvent();
    this._store.fDraggable?.fDragStarted?.emit(
      new FDragStartedEvent(
        event.kind,
        event.data ? { ...event.data } : undefined,
        event.fEventType,
      ),
    );
  }
}
