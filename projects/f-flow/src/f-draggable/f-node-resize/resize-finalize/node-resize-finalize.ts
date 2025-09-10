import { inject, Injectable } from '@angular/core';
import { NodeResizeFinalizeRequest } from './node-resize-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';

@Injectable()
@FExecutionRegister(NodeResizeFinalizeRequest)
export class NodeResizeFinalize implements IExecution<NodeResizeFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: NodeResizeFinalizeRequest): void {
    if (!this._isNodeResizeHandler()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }

  private _isNodeResizeHandler(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof NodeResizeDragHandler);
  }
}
