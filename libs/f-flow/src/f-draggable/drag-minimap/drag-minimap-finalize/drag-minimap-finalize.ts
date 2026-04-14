import { inject, Injectable } from '@angular/core';
import { DragMinimapFinalizeRequest } from './drag-minimap-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext, isDragMinimapHandler } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(DragMinimapFinalizeRequest)
export class DragMinimapFinalize implements IExecution<DragMinimapFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: DragMinimapFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._dragSession.draggableItems.some(isDragMinimapHandler);
  }
}
