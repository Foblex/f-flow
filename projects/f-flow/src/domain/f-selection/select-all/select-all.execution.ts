import { SelectAllRequest } from './select-all.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(SelectAllRequest)
export class SelectAllExecution implements IExecution<SelectAllRequest, void> {

  constructor(
    private fDataContext: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: SelectAllRequest): void {
    this.fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
    });
    this.fDraggableDataContext.selectedItems = [];
    this.fDataContext.fNodes.forEach((x) => {
      x.select();
      this.fDraggableDataContext.selectedItems.push(x);
    });
    this.fDataContext.fConnections.forEach((x) => {
      x.select();
      this.fDraggableDataContext.selectedItems.push(x);
    });
    this.fDraggableDataContext.isSelectedChanged = true;
  }
}
