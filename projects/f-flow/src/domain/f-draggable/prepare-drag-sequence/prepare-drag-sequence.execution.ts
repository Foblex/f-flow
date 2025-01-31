import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { PrepareDragSequenceRequest } from './prepare-drag-sequence-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { StartDragSequenceRequest } from '../start-drag-sequence';

@Injectable()
@FExecutionRegister(PrepareDragSequenceRequest)
export class PrepareDragSequenceExecution implements IExecution<PrepareDragSequenceRequest, void> {

  private _fMediator = inject(FMediator);

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: PrepareDragSequenceRequest): void {
    this._callPrepareDragSequence();

    this._fMediator.execute<void>(new StartDragSequenceRequest());
  }

  private _callPrepareDragSequence(): void {
    this._fDraggableDataContext.draggableItems.forEach((item) => {
      item.prepareDragSequence?.();
    });
  }
}
