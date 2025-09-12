import { inject, Injectable } from '@angular/core';
import { DropToGroupFinalizeRequest } from './drop-to-group-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeDropToGroupDragHandler } from '../f-node-drop-to-group.drag-handler';
import { FComponentsStore } from '../../../f-storage';
import { MoveSummaryDragHandler } from '../../f-node-move';
import { FDropToGroupEvent } from '../f-drop-to-group.event';
import { IPointerEvent } from "../../../drag-toolkit";

@Injectable()
@FExecutionRegister(DropToGroupFinalizeRequest)
export class DropToGroupFinalize
  implements IExecution<DropToGroupFinalizeRequest, void> {

  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);

  public handle(request: DropToGroupFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const item = this._getDragHandleItem();
    if (item.fNodeWithRect) {
      this._emitDroppedChildrenEvent(item.fNodeWithRect.node.fId(), request.event);
    }
    item.onPointerUp?.();
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems
      .some((x) => x instanceof FNodeDropToGroupDragHandler);
  }

  private _emitDroppedChildrenEvent(fTargetId: string, event: IPointerEvent): void {
    this._store.fDraggable?.fDropToGroup.emit(
      new FDropToGroupEvent(fTargetId, this._getDroppedIds(), event.getPosition()),
    );
  }

  private _getDragHandleItem(): FNodeDropToGroupDragHandler {
    const result = this._findDragHandleItem();
    if (!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }

    return result;
  }

  private _findDragHandleItem(): FNodeDropToGroupDragHandler | undefined {
    return this._dragContext.draggableItems
      .find((x) => x instanceof FNodeDropToGroupDragHandler);
  }

  private _getDroppedIds(): string[] {
    const nodeOrGroups = this._getSummaryHandler().allDraggedNodeHandlers
      .map((x) => x.nodeOrGroup);

    const idSet = new Set(nodeOrGroups.map(n => n.fId()));

    return nodeOrGroups.filter(node => {
      const parentId = node.fParentId();

      return !parentId || !idSet.has(parentId);
    }).map(node => node.fId());
  }

  private _getSummaryHandler(): MoveSummaryDragHandler {
    const result = this._dragContext.draggableItems
      .find((x) => x instanceof MoveSummaryDragHandler);
    if (!result) {
      throw new Error('Drop To Group can`t be used without MoveSummaryDragHandler');
    }

    return result;
  }
}
