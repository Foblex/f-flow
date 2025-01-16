import { Injectable } from '@angular/core';
import { CanvasMoveFinalizeRequest } from './canvas-move-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { CanvasDragHandler } from '../canvas.drag-handler';

@Injectable()
@FExecutionRegister(CanvasMoveFinalizeRequest)
export class CanvasMoveFinalizeExecution implements IExecution<CanvasMoveFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: CanvasMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this.fDraggableDataContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isValid(): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof CanvasDragHandler
    );
  }
}
