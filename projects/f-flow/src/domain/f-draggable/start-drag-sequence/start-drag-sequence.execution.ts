import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { StartDragSequenceRequest } from './start-drag-sequence-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { EmitSelectionChangeEventRequest } from '../emit-selection-change-event';

@Injectable()
@FExecutionRegister(StartDragSequenceRequest)
export class StartDragSequenceExecution implements IExecution<StartDragSequenceRequest, void> {

  private _fMediator = inject(FMediator);

  private _fComponentsStore = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._fComponentsStore.fDraggable!.hostElement;
  }

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: StartDragSequenceRequest): void {
    this._fDraggableDataContext.draggableItems.forEach((item) => {
      item.initialize?.();
    });

    if (this._fDraggableDataContext.draggableItems.length > 0) {
      this._hostElement.classList.add('f-dragging');
      this._fMediator.send<void>(new EmitSelectionChangeEventRequest());
    }
  }
}
