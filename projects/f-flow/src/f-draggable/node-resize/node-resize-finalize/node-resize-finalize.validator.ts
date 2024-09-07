import { Injectable } from '@angular/core';
import { NodeResizeFinalizeRequest } from './node-resize-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';

@Injectable()
@FValidatorRegister(NodeResizeFinalizeRequest)
export class NodeResizeFinalizeValidator implements IValidator<NodeResizeFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeResizeFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) =>
      x instanceof NodeResizeDragHandler
    );
  }
}
