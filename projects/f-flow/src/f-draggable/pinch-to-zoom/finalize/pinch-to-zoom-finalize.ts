import { inject, Injectable } from '@angular/core';
import { PinchToZoomFinalizeRequest } from './pinch-to-zoom-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { PinchToZoomHandler } from '../handler';

@Injectable()
@FExecutionRegister(PinchToZoomFinalizeRequest)
export class PinchToZoomFinalize implements IExecution<PinchToZoomFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_: PinchToZoomFinalizeRequest): void {
    if (!this._hasPinchZoomHandler()) {
      return;
    }

    for (const item of this._dragSession.draggableItems) {
      item.onPointerUp?.();
    }
  }

  private _hasPinchZoomHandler(): boolean {
    return this._dragSession.draggableItems.some((x) => x instanceof PinchToZoomHandler);
  }
}
