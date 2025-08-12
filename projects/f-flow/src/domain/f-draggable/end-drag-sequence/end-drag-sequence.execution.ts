import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EndDragSequenceRequest } from './end-drag-sequence-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { F_CSS_CLASS } from '../../css-cls';

/**
 * Execution that handles the end of a drag sequence.
 */
@Injectable()
@FExecutionRegister(EndDragSequenceRequest)
export class EndDragSequenceExecution implements IExecution<EndDragSequenceRequest, void> {

  private readonly _store = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._store.fDraggable!.hostElement;
  }

  private _dragContext = inject(FDraggableDataContext);

  public handle(request: EndDragSequenceRequest): void {
    this._hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);

    this._dragContext.reset();
    this._emitDragEnded();
  }

  private _emitDragEnded(): void {
    this._store.fDraggable?.fDragEnded?.emit();
  }
}
