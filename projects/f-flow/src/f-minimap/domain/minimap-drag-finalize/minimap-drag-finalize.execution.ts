import { Injectable } from '@angular/core';
import { MinimapDragFinalizeRequest } from './minimap-drag-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(MinimapDragFinalizeRequest)
export class MinimapDragFinalizeExecution implements IExecution<MinimapDragFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: MinimapDragFinalizeRequest): void {
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.complete?.();
    });
  }
}
