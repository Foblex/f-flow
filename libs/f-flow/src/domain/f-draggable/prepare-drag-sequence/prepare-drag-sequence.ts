import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../_libs/f-mediator';
import { PrepareDragSequenceRequest } from './prepare-drag-sequence-request';
import { EmitStartDragSequenceEventRequest, FDraggableDataContext } from '../../../f-draggable';

/**
 * Execution that prepares the drag sequence by invoking the prepareDragSequence method on each draggable item.
 */
@Injectable()
export class PrepareDragSequence implements IExecution<PrepareDragSequenceRequest, void> {
  private readonly _mediator = inject(FMediator);

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_: PrepareDragSequenceRequest): void {
    this._callPrepareDragSequence();

    this._mediator.execute(new EmitStartDragSequenceEventRequest());
  }

  private _callPrepareDragSequence(): void {
    this._dragContext.draggableItems.forEach((x) => x.prepareDragSequence?.());
  }
}
