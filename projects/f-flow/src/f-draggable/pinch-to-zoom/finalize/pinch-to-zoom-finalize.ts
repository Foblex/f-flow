import { inject, Injectable } from '@angular/core';
import { PinchToZoomFinalizeRequest } from './pinch-to-zoom-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeRotateDragHandler, FNodeRotateFinalizeRequest } from '../../f-node-rotate';

@Injectable()
@FExecutionRegister(PinchToZoomFinalizeRequest)
export class PinchToZoomFinalize implements IExecution<PinchToZoomFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: FNodeRotateFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof FNodeRotateDragHandler);
  }
}
