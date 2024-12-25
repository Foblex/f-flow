import { EventEmitter, inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { EmitSelectionChangeEventRequest } from './emit-selection-change-event-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext, FSelectionChangeEvent } from '../../../f-draggable';
import { GetSelectionRequest } from '../../f-selection';
import { TransformChangedRequest } from '../../../f-storage/features/transform-changed';

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
    this._fSelectionChange.emit(this._fMediator.send<FSelectionChangeEvent>(new GetSelectionRequest()));
    this._fDraggableDataContext.isSelectedChanged = false;
    this._fMediator.send<void>(new TransformChangedRequest());
  }
}
