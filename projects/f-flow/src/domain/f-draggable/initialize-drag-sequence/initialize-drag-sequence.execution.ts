import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { InitializeDragSequenceRequest } from './initialize-drag-sequence-request';
import { FDraggableDataContext } from '../../../f-draggable';

/**
 * Execution that initializes the drag sequence by resetting the FDraggableDataContext.
 */
@Injectable()
@FExecutionRegister(InitializeDragSequenceRequest)
export class InitializeDragSequenceExecution implements IExecution<InitializeDragSequenceRequest, void> {

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: InitializeDragSequenceRequest): void {
    this._dragContext.reset();
  }
}
