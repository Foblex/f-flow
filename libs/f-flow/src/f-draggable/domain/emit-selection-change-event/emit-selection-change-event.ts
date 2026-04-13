import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { EmitSelectionChangeEventRequest } from './emit-selection-change-event-request';
import { FComponentsStore, NotifyTransformChangedRequest } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { GetCurrentSelectionRequest, ICurrentSelection } from '../../../domain';
import { FSelectionChangeEvent } from '../../f-selection-change-event';

/**
 * Execution that emits a selection change event when the selection changes.
 * It retrieves the current selection and emits it through the FSelectionChangeEvent.
 */
@Injectable()
@FExecutionRegister(EmitSelectionChangeEventRequest)
export class EmitSelectionChangeEvent implements IExecution<EmitSelectionChangeEventRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: EmitSelectionChangeEventRequest): void {
    if (!this._dragSession.isSelectedChanged) {
      return;
    }

    this._emitSelectionChange(this._getSelection());
    this._dragSession.isSelectedChanged = false;
    this._mediator.execute<void>(new NotifyTransformChangedRequest());
  }

  private _getSelection(): ICurrentSelection {
    return this._mediator.execute<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  private _emitSelectionChange(selection: ICurrentSelection): void {
    this._store.fDraggable?.fSelectionChange.emit(
      new FSelectionChangeEvent(selection.fNodeIds, selection.fGroupIds, selection.fConnectionIds),
    );
  }
}
