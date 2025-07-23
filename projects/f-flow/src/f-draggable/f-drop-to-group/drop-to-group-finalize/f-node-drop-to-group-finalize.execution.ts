import { inject, Injectable } from '@angular/core';
import { FNodeDropToGroupFinalizeRequest } from './f-node-drop-to-group-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeDropToGroupDragHandler } from '../f-node-drop-to-group.drag-handler';
import { FComponentsStore } from '../../../f-storage';
import { FSummaryNodeMoveDragHandler } from '../../f-node-move';
import { FDropToGroupEvent } from '../f-drop-to-group.event';
import {IPointerEvent} from "../../../drag-toolkit";

@Injectable()
@FExecutionRegister(FNodeDropToGroupFinalizeRequest)
export class FNodeDropToGroupFinalizeExecution
  implements IExecution<FNodeDropToGroupFinalizeRequest, void> {

  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _fComponentsStore = inject(FComponentsStore);

  public handle(request: FNodeDropToGroupFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const item = this._getDragHandleItem();
    if(item.fNodeWithRect) {
      this._emitDroppedChildrenEvent(item.fNodeWithRect.node.fId(), request.event);
    }
    item.onPointerUp?.();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems
      .some((x) => x instanceof FNodeDropToGroupDragHandler);
  }

  private _emitDroppedChildrenEvent(fTargetId: string, event: IPointerEvent): void {
    this._fComponentsStore.fDraggable?.fDropToGroup.emit(
      new FDropToGroupEvent(fTargetId, this._getDraggedNodeIds(), event.getPosition())
    );
  }

  private _getDragHandleItem(): FNodeDropToGroupDragHandler {
    const result = this._findDragHandleItem();
    if(!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }
    return result;
  }

  private _findDragHandleItem(): FNodeDropToGroupDragHandler | undefined {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FNodeDropToGroupDragHandler);
  }

  private _getDraggedNodeIds(): string[] {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FSummaryNodeMoveDragHandler)?.fHandlers
      .map((x) => x.fNode.fId()) || [];
  }
}
