import { SelectAllRequest } from './select-all.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(SelectAllRequest)
export class SelectAllExecution implements IExecution<SelectAllRequest, void> {

  private _fDraggableDataContext = inject(FDraggableDataContext);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: SelectAllRequest): void {
    this._fDraggableDataContext.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._fDraggableDataContext.selectedItems = [];
    this._fComponentsStore.fNodes.forEach((x) => {
      x.markAsSelected();
      this._fDraggableDataContext.selectedItems.push(x);
    });
    this._fComponentsStore.fConnections.forEach((x) => {
      x.markAsSelected();
      this._fDraggableDataContext.selectedItems.push(x);
    });
    this._fDraggableDataContext.isSelectedChanged = true;
  }
}
