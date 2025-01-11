import { EventEmitter, inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { EmitSelectionChangeEventRequest } from './emit-selection-change-event-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext, FSelectionChangeEvent } from '../../../f-draggable';
import { GetCurrentSelectionRequest, ICurrentSelection } from '../../f-selection';
import { NotifyTransformChangedRequest } from '../../../f-storage/features/notify-transform-changed';

@Injectable()
@FExecutionRegister(EmitSelectionChangeEventRequest)
export class EmitSelectionChangeEventExecution implements IExecution<EmitSelectionChangeEventRequest, void> {

  private _fMediator = inject(FMediator);

  private _fComponentsStore = inject(FComponentsStore);

  private get _fSelectionChange(): EventEmitter<FSelectionChangeEvent> {
    return this._fComponentsStore.fDraggable!.fSelectionChange;
  }

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: EmitSelectionChangeEventRequest): void {
    if (
      !this._fDraggableDataContext.isSelectedChanged
    ) {
      return;
    }

    this._emitSelectionChange(this._getSelection());
    this._fDraggableDataContext.isSelectedChanged = false;
    this._fMediator.send<void>(new NotifyTransformChangedRequest());
  }

  private _getSelection(): ICurrentSelection {
    return this._fMediator.send<ICurrentSelection>(new GetCurrentSelectionRequest());
  }

  private _emitSelectionChange(selection: ICurrentSelection): void {
    this._fSelectionChange.emit(
      new FSelectionChangeEvent(selection.nodes, selection.groups, selection.connections)
    );
  }
}
