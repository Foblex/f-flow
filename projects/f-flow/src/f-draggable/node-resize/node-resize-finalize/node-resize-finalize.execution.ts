import { Injectable } from '@angular/core';
import { NodeResizeFinalizeRequest } from './node-resize-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';

@Injectable()
@FExecutionRegister(NodeResizeFinalizeRequest)
export class NodeResizeFinalizeExecution implements IExecution<NodeResizeFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: NodeResizeFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) =>
      x instanceof NodeResizeDragHandler
    );
  }
}
