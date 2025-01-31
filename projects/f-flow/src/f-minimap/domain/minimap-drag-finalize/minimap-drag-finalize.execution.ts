import { Injectable } from '@angular/core';
import { MinimapDragFinalizeRequest } from './minimap-drag-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable';
import { FMinimapDragHandler } from '../f-minimap.drag-handler';

@Injectable()
@FExecutionRegister(MinimapDragFinalizeRequest)
export class MinimapDragFinalizeExecution implements IExecution<MinimapDragFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: MinimapDragFinalizeRequest): void {
    if(!this._isValid()) {
      return;
    }
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof FMinimapDragHandler
    );
  }
}
