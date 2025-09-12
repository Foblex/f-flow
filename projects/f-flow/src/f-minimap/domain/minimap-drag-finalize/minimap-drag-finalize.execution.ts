import { inject, Injectable } from '@angular/core';
import { MinimapDragFinalizeRequest } from './minimap-drag-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';
import { FMinimapDragHandler } from '../f-minimap.drag-handler';

@Injectable()
@FExecutionRegister(MinimapDragFinalizeRequest)
export class MinimapDragFinalizeExecution implements IExecution<MinimapDragFinalizeRequest, void> {

  private readonly _draggableDataContext = inject(FDraggableDataContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(request: MinimapDragFinalizeRequest): void {
    if(!this._isValid()) {
      return;
    }
    this._draggableDataContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._draggableDataContext.draggableItems.some(
      (x) => x instanceof FMinimapDragHandler,
    );
  }
}
