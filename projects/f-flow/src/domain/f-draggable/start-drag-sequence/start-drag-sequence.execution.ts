import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { StartDragSequenceRequest } from './start-drag-sequence-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { EmitSelectionChangeEventRequest } from '../emit-selection-change-event';
import { F_CSS_CLASS } from '../../css-cls';

/**
 * Execution that starts the drag sequence by adding a dragging class to the host element
 */
@Injectable()
@FExecutionRegister(StartDragSequenceRequest)
export class StartDragSequenceExecution implements IExecution<StartDragSequenceRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _hostElement(): HTMLElement {
    return this._store.fDraggable!.hostElement;
  }

  public handle(_request: StartDragSequenceRequest): void {
    if (this._dragContext.draggableItems.length > 0) {
      this._hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
      this._mediator.execute<void>(new EmitSelectionChangeEventRequest());
      this._emitDragStarted();
    }
  }

  private _emitDragStarted(): void {
    this._store.fDraggable?.fDragStarted?.emit({
      fEventType: this._dragContext.draggableItems[0].fEventType,
      fData: { ...this._dragContext.draggableItems[0].fData },
    });
  }
}
