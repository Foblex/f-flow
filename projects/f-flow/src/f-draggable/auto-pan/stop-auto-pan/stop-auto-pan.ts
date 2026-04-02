import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { StopAutoPanRequest } from './stop-auto-pan-request';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(StopAutoPanRequest)
export class StopAutoPan implements IExecution<StopAutoPanRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: StopAutoPanRequest): void {
    if (this._dragContext.autoPanFrameId !== null) {
      cancelAnimationFrame(this._dragContext.autoPanFrameId);
      this._dragContext.autoPanFrameId = null;
    }

    if (!this._dragContext.isAutoPanCanvasMoved) {
      return;
    }

    this._store.fCanvas?.emitCanvasChangeEvent();
    this._dragContext.isAutoPanCanvasMoved = false;
  }
}
