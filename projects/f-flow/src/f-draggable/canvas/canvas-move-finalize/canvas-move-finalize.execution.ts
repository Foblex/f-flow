import { Injectable } from '@angular/core';
import { CanvasMoveFinalizeRequest } from './canvas-move-finalize.request';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(CanvasMoveFinalizeRequest)
export class CanvasMoveFinalizeExecution implements IExecution<CanvasMoveFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: CanvasMoveFinalizeRequest): void {
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.complete?.();
    });
  }
}
