import { inject, Injectable } from '@angular/core';
import { ResizeNodeFinalizeRequest } from './resize-node-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { isResizeNodeHandler } from '../is-resize-node-handler';

@Injectable()
@FExecutionRegister(ResizeNodeFinalizeRequest)
export class ResizeNodeFinalize implements IExecution<ResizeNodeFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: ResizeNodeFinalizeRequest): void {
    if (!this._isNodeResizeHandler()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isNodeResizeHandler(): boolean {
    return this._dragSession.draggableItems.some((x) => isResizeNodeHandler(x));
  }
}
