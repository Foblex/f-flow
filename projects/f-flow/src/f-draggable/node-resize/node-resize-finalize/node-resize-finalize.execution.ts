import { Injectable } from '@angular/core';
import { NodeResizeFinalizeRequest } from './node-resize-finalize.request';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FExecutionRegister(NodeResizeFinalizeRequest)
export class NodeResizeFinalizeExecution implements IExecution<NodeResizeFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: NodeResizeFinalizeRequest): void {
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.complete?.();
    });
  }
}
