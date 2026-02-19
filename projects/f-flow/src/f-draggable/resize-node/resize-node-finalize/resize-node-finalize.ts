import { inject, Injectable } from '@angular/core';
import { ResizeNodeFinalizeRequest } from './resize-node-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(ResizeNodeFinalizeRequest)
export class ResizeNodeFinalize implements IExecution<ResizeNodeFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: ResizeNodeFinalizeRequest): void {
    if (!this._isNodeResizeHandler()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isNodeResizeHandler(): boolean {
    return this._dragContext.draggableItems.some((x) => x.getEvent().kind === 'node-resize');
  }
}
