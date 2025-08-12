import { inject, Injectable } from '@angular/core';
import { FNodeResizeFinalizeRequest } from './f-node-resize-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeResizeDragHandler } from '../f-node-resize.drag-handler';

@Injectable()
@FExecutionRegister(FNodeResizeFinalizeRequest)
export class FNodeResizeFinalizeExecution implements IExecution<FNodeResizeFinalizeRequest, void> {

  private _dragContext = inject(FDraggableDataContext);

  public handle(request: FNodeResizeFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) =>
      x instanceof FNodeResizeDragHandler
    );
  }
}
