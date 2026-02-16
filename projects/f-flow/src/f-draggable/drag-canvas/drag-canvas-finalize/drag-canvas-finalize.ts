import { inject, Injectable } from '@angular/core';
import { DragCanvasFinalizeRequest } from './drag-canvas-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { DragCanvasHandler } from '../drag-canvas-handler';

@Injectable()
@FExecutionRegister(DragCanvasFinalizeRequest)
export class DragCanvasFinalize implements IExecution<DragCanvasFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: DragCanvasFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof DragCanvasHandler);
  }
}
