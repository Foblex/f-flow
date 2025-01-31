import { ClearSelectionRequest } from './clear-selection.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(ClearSelectionRequest)
export class ClearSelectionExecution implements IExecution<ClearSelectionRequest, void> {

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: ClearSelectionRequest): void {
    this._fDraggableDataContext.selectedItems.forEach((x) => x.unmarkAsSelected());
    this._fDraggableDataContext.selectedItems = [];
    this._fDraggableDataContext.isSelectedChanged = true;
  }
}
