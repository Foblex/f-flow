import { EventEmitter, inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { EmitSelectionChangeEventRequest } from './emit-selection-change-event-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext, FSelectionChangeEvent } from '../../../f-draggable';
import { GetCurrentSelectionRequest, ICurrentSelection } from '../../f-selection';
import { NotifyTransformChangedRequest } from '../../../f-storage';

/**
 * Execution that emits a selection change event when the selection changes.
 * It retrieves the current selection and emits it through the FSelectionChangeEvent.
 */
@Injectable()
@FExecutionRegister(EmitSelectionChangeEventRequest)
export class EmitSelectionChangeEventExecution implements IExecution<EmitSelectionChangeEventRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _fSelectionChange(): EventEmitter<FSelectionChangeEvent> {
    return this._store.fDraggable!.fSelectionChange;
  }

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: EmitSelectionChangeEventRequest): void {
    if (
      !this._dragContext.isSelectedChanged
    ) {
      return;
    }

    this._emitSelectionChange(this._getSelection());
    this._dragContext.isSelectedChanged = false;
    this._mediator.execute<void>(new NotifyTransformChangedRequest());
  }

  private _getSelection(): ICurrentSelection {
    return this._mediator.execute<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  private _emitSelectionChange(selection: ICurrentSelection): void {
    this._fSelectionChange.emit(
      new FSelectionChangeEvent(selection.fNodeIds, selection.fGroupIds, selection.fConnectionIds),
    );
  }
}
