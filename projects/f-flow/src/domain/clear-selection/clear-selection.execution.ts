import { ClearSelectionRequest } from './clear-selection.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable';

@Injectable()
@FExecutionRegister(ClearSelectionRequest)
export class ClearSelectionExecution implements IExecution<ClearSelectionRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: ClearSelectionRequest): void {
    this.fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
    });
    this.fDraggableDataContext.selectedItems = [];
    this.fDraggableDataContext.isSelectedChanged = true;
  }
}
