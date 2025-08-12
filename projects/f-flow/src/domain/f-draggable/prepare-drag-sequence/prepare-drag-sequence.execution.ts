import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { PrepareDragSequenceRequest } from './prepare-drag-sequence-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { StartDragSequenceRequest } from '../start-drag-sequence';

/**
 * Execution that prepares the drag sequence by invoking the prepareDragSequence method on each draggable item.
 */
@Injectable()
@FExecutionRegister(PrepareDragSequenceRequest)
export class PrepareDragSequenceExecution implements IExecution<PrepareDragSequenceRequest, void> {

  private readonly _mediator = inject(FMediator);

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: PrepareDragSequenceRequest): void {
    this._callPrepareDragSequence();

    this._mediator.execute<void>(new StartDragSequenceRequest());
  }

  private _callPrepareDragSequence(): void {
    this._dragContext.draggableItems.forEach((item) => {
      item.prepareDragSequence?.();
    });
  }
}
