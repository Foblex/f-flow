import { SelectAllRequest } from './select-all.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';

/**
 * Execution that selects all components in the FComponentsStore.
 * It marks all nodes and connections as selected and updates the selected items in the FDraggableDataContext.
 */
@Injectable()
@FExecutionRegister(SelectAllRequest)
export class SelectAllExecution implements IExecution<SelectAllRequest, void> {

  private _dragContext = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);

  public handle(request: SelectAllRequest): void {
    this._dragContext.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._dragContext.selectedItems = [];
    this._store.fNodes.forEach((x) => {
      x.markAsSelected();
      this._dragContext.selectedItems.push(x);
    });
    this._store.fConnections.forEach((x) => {
      x.markAsSelected();
      this._dragContext.selectedItems.push(x);
    });
    this._dragContext.isSelectedChanged = true;
  }
}
