import { inject, Injectable } from '@angular/core';
import { DragNodeFinalizeRequest } from './drag-node-finalize-request';
import { IPoint, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { IsConnectionUnderNodeRequest } from '../../domain';
import { ISnapCoordinate, ISnapResult } from '../../../f-line-alignment';
import { DragNodeHandler } from '../drag-node-handler';
import { FNodeBase } from '../../../f-node';
import { FMoveNodesEvent } from '../f-move-nodes-event';

@Injectable()
@FExecutionRegister(DragNodeFinalizeRequest)
export class DragNodeFinalize implements IExecution<DragNodeFinalizeRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  private _dragHandler?: DragNodeHandler | undefined;

  public handle({ event }: DragNodeFinalizeRequest): void {
    this._dragHandler = this._getDragHandler();
    if (!this._dragHandler) {
      return;
    }

    const delta = this._buildDragDelta(event.getPosition());
    const snap = this._dragHandler.findClosestAlignment(delta);
    const snappedDelta = this._applySnapToDelta(delta, snap);

    this._finalizeMove(this._dragHandler, snappedDelta);
    this._emitNodeIntersectIfNeeded(this._dragHandler);
  }

  private _getDragHandler(): DragNodeHandler | undefined {
    return this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
  }

  private _buildDragDelta(pointerPosition: IPoint): Point {
    return Point.fromPoint(pointerPosition)
      .elementTransform(this._store.flowHost)
      .div(this._dragSession.onPointerDownScale)
      .sub(this._dragSession.onPointerDownPosition);
  }

  private _applySnapToDelta(delta: IPoint, snap?: ISnapResult): IPoint {
    if (!snap) {
      // return a copy, because below we will pass it to onPointerMove
      return { x: delta.x, y: delta.y };
    }

    const x = this._hasSnapValue(snap.xResult) ? delta.x - snap.xResult.distance! : delta.x;
    const y = this._hasSnapValue(snap.yResult) ? delta.y - snap.yResult.distance! : delta.y;

    return { x, y };
  }

  private _hasSnapValue(result: ISnapCoordinate): boolean {
    // distance is assumed to exist when value is defined (as in your current logic)
    return result.value !== undefined && result.value !== null;
  }

  private _finalizeMove(handler: DragNodeHandler, delta: IPoint): void {
    // finalize constraints for roots
    for (const root of handler.rootHandlers) {
      root.assignFinalConstraints();
    }

    handler.onPointerMove(delta);
    handler.onPointerUp?.();

    this._store.fDraggable?.fMoveNodes.emit(this._buildMoveNodesEvent(handler));
  }

  private _buildMoveNodesEvent(handler: DragNodeHandler): FMoveNodesEvent {
    // Prefer new event shape: kind/data
    // but keep backward compat: fData
    const dragEvent = handler.getEvent();
    const data = dragEvent.data ?? dragEvent.fData;

    const ids: string[] = data?.fNodeIds ?? [];

    const nodes = ids.map((id) => ({
      id,
      position: this._store.nodes.get(id)?._position as IPoint,
    }));

    return new FMoveNodesEvent(nodes);
  }

  private _emitNodeIntersectIfNeeded(handler: DragNodeHandler): void {
    if (!this._isDraggedJustOneNode(handler) || !this._store.fDraggable?.fEmitOnNodeIntersect) {
      return;
    }

    const nodeOrGroup = handler.rootHandlers[0].nodeOrGroup as FNodeBase;

    queueMicrotask(() => this._mediator.execute(new IsConnectionUnderNodeRequest(nodeOrGroup)));
  }

  private _isDraggedJustOneNode(handler: DragNodeHandler): boolean {
    return handler.rootHandlers.length === 1;
  }
}
