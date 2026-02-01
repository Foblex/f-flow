import { inject, Injectable } from '@angular/core';
import { DropToGroupFinalizeRequest } from './drop-to-group-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { DropToGroupHandler } from '../drop-to-group-handler';
import { FComponentsStore } from '../../../f-storage';
import { DragNodeHandler } from '../../drag-node';
import { FDropToGroupEvent } from '../f-drop-to-group-event';
import { IPointerEvent } from '../../../drag-toolkit';

@Injectable()
@FExecutionRegister(DropToGroupFinalizeRequest)
export class DropToGroupFinalize implements IExecution<DropToGroupFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);

  public handle({ event }: DropToGroupFinalizeRequest): void {
    const dropHandler = this._findDropHandler();
    if (!dropHandler) {
      return;
    }

    const target = dropHandler.activeTarget?.node;
    if (target) {
      this._emitDropToGroupEvent(target.fId(), event);
    }

    dropHandler.onPointerUp?.();
  }

  private _findDropHandler(): DropToGroupHandler | undefined {
    return this._dragSession.draggableItems.find((x) => x instanceof DropToGroupHandler);
  }

  private _emitDropToGroupEvent(targetId: string, event: IPointerEvent): void {
    this._store.fDraggable?.fDropToGroup.emit(
      new FDropToGroupEvent(targetId, this._getTopLevelDraggedIds(), event.getPosition()),
    );
  }

  /**
   * Returns only "top-level" dragged items:
   * if a node's parent is also in dragged set, we exclude the child.
   */
  private _getTopLevelDraggedIds(): string[] {
    const summary = this._getMoveSummaryHandler();

    const dragged = summary.items.map((x) => x.nodeOrGroup);

    const draggedIdSet = new Set(dragged.map((n) => n.fId()));

    const result: string[] = [];
    for (const node of dragged) {
      const parentId = node.fParentId();
      if (!parentId || !draggedIdSet.has(parentId)) {
        result.push(node.fId());
      }
    }

    return result;
  }

  private _getMoveSummaryHandler(): DragNodeHandler {
    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);

    if (!handler) {
      throw new Error('DropToGroup requires DragNodeHandler.');
    }

    return handler;
  }
}
