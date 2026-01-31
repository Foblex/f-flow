import { inject, Injectable } from '@angular/core';
import { DropToGroupPreparationRequest } from './drop-to-group-preparation-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import {
  GetChildNodeIdsRequest,
  GetNormalizedElementRectRequest,
  GetParentNodesRequest,
} from '../../../domain';
import { FGroupDirective, FNodeBase } from '../../../f-node';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { DropToGroupHandler } from '../drop-to-group-handler';
import { MoveSummaryDragHandler } from '../../f-node-move';
import { FExternalItemDragHandler } from '../../../f-external-item';
import { SortDropCandidatesByLayerRequest } from '../sort-drop-candidates-by-layer';
import { DragHandlerInjector } from '../../infrastructure';

@Injectable()
@FExecutionRegister(DropToGroupPreparationRequest)
export class DropToGroupPreparation implements IExecution<DropToGroupPreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _allNodes(): FNodeBase[] {
    return this._store.nodes.getAll<FNodeBase>();
  }

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private get _canvasOffset(): IPoint {
    return PointExtensions.sum(this._transform.position, this._transform.scaledPosition);
  }

  public handle({ event }: DropToGroupPreparationRequest): void {
    if (!this._canPrepare()) {
      return;
    }

    const dragTargetNode = this._allNodes.find((n) => n.isContains(event.targetElement));

    // If this is not an external drag and we can't resolve a target node — it's an invalid state.
    if (!dragTargetNode && !this._hasExternalDrag()) {
      throw new Error('Drag target node not found');
    }

    let targets = this._sortedTargetsForDrop();

    // We can drop items only to children of direct parent (if target is inside some parent).
    if (dragTargetNode) {
      const parentId = dragTargetNode.fParentId();
      const allowedIds = this._mediator.execute<string[]>(new GetChildNodeIdsRequest(parentId));

      if (allowedIds.length) {
        targets = targets.filter((t) => allowedIds.includes(t.node.fId()));
      }
    }

    const handler = this._dragInjector.get(DropToGroupHandler);
    handler.initialize(targets);

    this._dragContext.draggableItems.push(handler);
  }

  private _canPrepare(): boolean {
    return this._hasMoveDrag() || this._hasExternalDrag();
  }

  private _hasMoveDrag(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof MoveSummaryDragHandler);
  }

  private _hasExternalDrag(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof FExternalItemDragHandler);
  }

  private _sortedTargetsForDrop(): INodeWithRect[] {
    const dragged = this._getDraggedNodes();
    const draggingGroup = dragged.some((x) => x instanceof FGroupDirective);

    const draggedWithParents = this._withParents(dragged);
    const eligible = this._eligibleTargets(draggedWithParents, draggingGroup);

    const targets = eligible.map((node) => {
      const rect = this._mediator.execute<IRect>(
        new GetNormalizedElementRectRequest(node.hostElement),
      );

      return { node, rect: this._toCanvasRect(rect) };
    });

    return this._mediator.execute<INodeWithRect[]>(new SortDropCandidatesByLayerRequest(targets));
  }

  private _getDraggedNodes(): FNodeBase[] {
    const moveHandler = this._dragContext.draggableItems.find(
      (x) => x instanceof MoveSummaryDragHandler,
    );

    return moveHandler ? moveHandler.allDraggedNodeHandlers.map((h) => h.nodeOrGroup) : [];
  }

  private _withParents(nodes: FNodeBase[]): FNodeBase[] {
    return nodes.reduce((result: FNodeBase[], node: FNodeBase) => {
      result.push(node);

      const parents = this._mediator.execute<FNodeBase[]>(new GetParentNodesRequest(node));
      result.push(...parents);

      return result;
    }, []);
  }

  private _eligibleTargets(draggedWithParents: FNodeBase[], draggingGroup: boolean): FNodeBase[] {
    const nonDragged = this._allNodes.filter((n) => !draggedWithParents.includes(n));

    return draggingGroup ? nonDragged.filter((n) => n instanceof FGroupDirective) : nonDragged;
  }

  private _toCanvasRect(rect: IRect): IRect {
    const scale = this._transform.scale;

    return RectExtensions.initialize(
      rect.x * scale + this._canvasOffset.x,
      rect.y * scale + this._canvasOffset.y,
      rect.width * scale,
      rect.height * scale,
    );
  }
}
