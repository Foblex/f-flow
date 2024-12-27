import { Injectable } from '@angular/core';
import { NodeDragToParentFinalizeRequest } from './node-drag-to-parent-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';
import { NodeDragHandler } from '../node.drag-handler';
import { FDropToGroupEvent } from '../f-drop-to-group.event';
import { FComponentsStore } from '../../../f-storage';
import { IPointerEvent } from '@foblex/drag-toolkit';

@Injectable()
@FExecutionRegister(NodeDragToParentFinalizeRequest)
export class NodeDragToParentFinalizeExecution
  implements IExecution<NodeDragToParentFinalizeRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: NodeDragToParentFinalizeRequest): void {
    const item = this.getDragHandleItem();
    if(item.fNodeWithRect) {
      this.emitDroppedChildrenEvent(item.fNodeWithRect.node.fId, request.event);
    }
    item.onPointerUp?.();
  }

  private emitDroppedChildrenEvent(fTargetId: string, event: IPointerEvent): void {
    this.fComponentsStore.fDraggable?.fDropToGroup.emit(
      new FDropToGroupEvent(fTargetId, this.getDraggedNodeIds(), event.getPosition())
    );
  }

  private getDragHandleItem(): NodeDragToParentDragHandler {
    const result = this.findDragHandleItem();
    if(!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }
    return result;
  }

  private findDragHandleItem(): NodeDragToParentDragHandler | undefined {
    return this.fDraggableDataContext.draggableItems
      .find((x) => x instanceof NodeDragToParentDragHandler);
  }

  private getDraggedNodeIds(): string[] {
    return this.fDraggableDataContext.draggableItems
      .filter((x) => x instanceof NodeDragHandler)
      .map((x) => x.fNode.fId);
  }
}
