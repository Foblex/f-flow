import { Injectable } from '@angular/core';
import { SelectionAreaFinalizeRequest } from './selection-area-finalize.request';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(SelectionAreaFinalizeRequest)
export class SelectionAreaFinalizeExecution implements IExecution<SelectionAreaFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: SelectionAreaFinalizeRequest): void {
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.complete?.();
    });
  }
}
