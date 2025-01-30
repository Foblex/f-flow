import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { StartDragSequenceRequest } from './start-drag-sequence-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { EmitSelectionChangeEventRequest } from '../emit-selection-change-event';
import { F_CSS_CLASS } from '../../css-cls';

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
    if (this._fDraggableDataContext.draggableItems.length > 0) {
      this._hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
      this._fMediator.send<void>(new EmitSelectionChangeEventRequest());
      this._emitDragStarted();
    }
  }

  private _emitDragStarted(): void {
    this._fComponentsStore.fDraggable?.fDragStarted?.emit();
  }
}
