import { ClearSelectionRequest } from './clear-selection.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';

/**
 * Execution that clears the selection of items in the FDraggableDataContext.
 */
@Injectable()
@FExecutionRegister(ClearSelectionRequest)
export class ClearSelectionExecution implements IExecution<ClearSelectionRequest, void> {

  private _dragContext = inject(FDraggableDataContext);

  public handle(request: ClearSelectionRequest): void {
    this._dragContext.selectedItems.forEach((x) => x.unmarkAsSelected());
    this._dragContext.selectedItems = [];
    this._dragContext.isSelectedChanged = true;
  }
}
