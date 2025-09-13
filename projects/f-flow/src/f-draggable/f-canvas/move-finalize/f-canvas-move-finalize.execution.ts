import { inject, Injectable } from '@angular/core';
import { FCanvasMoveFinalizeRequest } from './f-canvas-move-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FCanvasDragHandler } from '../f-canvas.drag-handler';

@Injectable()
@FExecutionRegister(FCanvasMoveFinalizeRequest)
export class FCanvasMoveFinalizeExecution implements IExecution<FCanvasMoveFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: FCanvasMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof FCanvasDragHandler);
  }
}
