import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EndDragSequenceRequest } from './end-drag-sequence-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(EndDragSequenceRequest)
export class EndDragSequenceExecution implements IExecution<EndDragSequenceRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._fComponentsStore.fDraggable!.hostElement;
  }

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: EndDragSequenceRequest): void {
    this._hostElement.classList.remove('f-dragging');

    this._fDraggableDataContext.reset();
  }
}
