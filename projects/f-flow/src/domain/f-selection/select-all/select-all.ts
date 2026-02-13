import { SelectAllRequest } from './select-all-request';
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
export class SelectAll implements IExecution<SelectAllRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);

  public handle(_request: SelectAllRequest): void {
    this._dragSession.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._dragSession.selectedItems = [];
    this._store.nodes.getAll().forEach((x) => {
      x.markAsSelected();
      this._dragSession.selectedItems.push(x);
    });
    this._store.connections.getAll().forEach((x) => {
      x.markAsSelected();
      this._dragSession.selectedItems.push(x);
    });
    this._dragSession.isSelectedChanged = true;
  }
}
