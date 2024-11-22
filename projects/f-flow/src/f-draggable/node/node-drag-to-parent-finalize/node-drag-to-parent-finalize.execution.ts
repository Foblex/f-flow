import { Injectable } from '@angular/core';
import { NodeDragToParentFinalizeRequest } from './node-drag-to-parent-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';
import { NodeDragHandler } from '../node.drag-handler';
import { FDroppedChildrenEvent } from '../f-dropped-children.event';

@Injectable()
@FExecutionRegister(NodeDragToParentFinalizeRequest)
export class NodeDragToParentFinalizeExecution
  implements IExecution<NodeDragToParentFinalizeRequest, void> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: NodeDragToParentFinalizeRequest): void {
    const item = this.getItem();
    if(item.fNodeWithRect) {
      item.fNodeWithRect.node.droppedNodes.emit(
        new FDroppedChildrenEvent(this.getDraggedNodeIds(), request.event.getPosition())
      )
    }
    item.complete?.();
  }

  private getItem(): NodeDragToParentDragHandler {
    const result = this.fDraggableDataContext.draggableItems
      .find((x) => x instanceof NodeDragToParentDragHandler);
    if(!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }
    return result;
  }

  private getDraggedNodeIds(): string[] {
    return this.fDraggableDataContext.draggableItems
      .filter((x) => x instanceof NodeDragHandler)
      .map((x) => x.fNode.fId);
  }
}
