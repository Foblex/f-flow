import { Injectable } from '@angular/core';
import { NodeDragToParentFinalizeRequest } from './node-drag-to-parent-finalize.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';

@Injectable()
@FValidatorRegister(NodeDragToParentFinalizeRequest)
export class NodeDragToParentFinalizeValidator
  implements IValidator<NodeDragToParentFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeDragToParentFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems
      .some((x) => x instanceof NodeDragToParentDragHandler);
  }
}
