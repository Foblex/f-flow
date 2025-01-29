import { Injectable } from '@angular/core';
import { NodeDragToParentPreparationRequest } from './node-drag-to-parent-preparation.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { SummaryNodeDragHandler } from '../summary-node.drag-handler';

@Injectable()
@FValidatorRegister(NodeDragToParentPreparationRequest)
export class NodeDragToParentPreparationValidator
  implements IValidator<NodeDragToParentPreparationRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeDragToParentPreparationRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) => x instanceof SummaryNodeDragHandler);
  }
}
