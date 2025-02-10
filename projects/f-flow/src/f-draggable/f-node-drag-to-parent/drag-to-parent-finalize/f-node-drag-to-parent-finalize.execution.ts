import { inject, Injectable } from '@angular/core';
import { FNodeDragToParentFinalizeRequest } from './f-node-drag-to-parent-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeDragToParentDragHandler } from '../f-node-drag-to-parent.drag-handler';
import { FComponentsStore } from '../../../f-storage';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { FSummaryNodeMoveDragHandler } from '../../f-node-move';
import { FDropToGroupEvent } from '../f-drop-to-group.event';

@Injectable()
@FExecutionRegister(FNodeDragToParentFinalizeRequest)
export class FNodeDragToParentFinalizeExecution
  implements IExecution<FNodeDragToParentFinalizeRequest, void> {

  private _fDraggableDataContext = inject(FDraggableDataContext);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: FNodeDragToParentFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const item = this._getDragHandleItem();
    if(item.fNodeWithRect) {
      this._emitDroppedChildrenEvent(item.fNodeWithRect.node.fId, request.event);
    }
    item.onPointerUp?.();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems
      .some((x) => x instanceof FNodeDragToParentDragHandler);
  }

  private _emitDroppedChildrenEvent(fTargetId: string, event: IPointerEvent): void {
    this._fComponentsStore.fDraggable?.fDropToGroup.emit(
      new FDropToGroupEvent(fTargetId, this._getDraggedNodeIds(), event.getPosition())
    );
  }

  private _getDragHandleItem(): FNodeDragToParentDragHandler {
    const result = this._findDragHandleItem();
    if(!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }
    return result;
  }

  private _findDragHandleItem(): FNodeDragToParentDragHandler | undefined {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FNodeDragToParentDragHandler);
  }

  private _getDraggedNodeIds(): string[] {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FSummaryNodeMoveDragHandler)!.fHandlers
      .map((x) => x.fNode.fId);
  }
}
