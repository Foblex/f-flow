import { inject, Injectable, Injector } from '@angular/core';
import { DropToGroupPreparationRequest } from './drop-to-group-preparation-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { GetChildNodeIdsRequest, GetNormalizedElementRectRequest, GetParentNodesRequest } from '../../../domain';
import { FGroupDirective, FNodeBase } from '../../../f-node';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeDropToGroupDragHandler } from '../f-node-drop-to-group.drag-handler';
import { MoveSummaryDragHandler } from '../../f-node-move';
import { FExternalItemDragHandler } from "../../../f-external-item";
import { SortContainersForDropByLayerRequest } from "../sort-containers-for-drop-by-layer";

@Injectable()
@FExecutionRegister(DropToGroupPreparationRequest)
export class DropToGroupPreparation
  implements IExecution<DropToGroupPreparationRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _allNodesAndGroups(): FNodeBase[] {
    return this._store.fNodes;
  }

  private get _canvasTransform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private get _canvasPosition(): IPoint {
    return PointExtensions.sum(this._canvasTransform.position, this._canvasTransform.scaledPosition)
  }

  public handle({ event }: DropToGroupPreparationRequest): void {
    if (!this._canPrepareDropToGroup()) {
      return;
    }
    const _dragTarget = this._allNodesAndGroups.find((x) =>
      x.isContains(event.targetElement),
    );

    if (!_dragTarget && !this._isExternalItemDragHandler()) {
      throw new Error('Drag target node not found');
    }

    let targetRects = this._mediator.execute<INodeWithRect[]>(
      new SortContainersForDropByLayerRequest(this._collectGroupingTargetRects()),
    );

    if (_dragTarget) {
      // We can drop items only to children of direct parent
      const childIds = this._mediator.execute<string[]>(new GetChildNodeIdsRequest(_dragTarget.fParentId()));
      if (childIds.length) {
        targetRects = targetRects.filter(t => childIds.includes(t.node.fId()));
      }
    }

    this._dragContext.draggableItems.push(new FNodeDropToGroupDragHandler(
      this._injector,
      targetRects,
    ));
  }

  private _canPrepareDropToGroup(): boolean {
    return this._isNodeDragHandler() || this._isExternalItemDragHandler();
  }

  private _isNodeDragHandler(): boolean {
    return this._dragContext.draggableItems
      .some((x) => x instanceof MoveSummaryDragHandler);
  }

  private _isExternalItemDragHandler(): boolean {
    return this._dragContext.draggableItems
      .some((x) => x instanceof FExternalItemDragHandler);
  }

  private _collectGroupingTargetRects(): INodeWithRect[] {
    const dragged = this._draggedNodes();
    const draggingGroup = dragged.some((x) => x instanceof FGroupDirective);

    const draggedNodes = this._draggedNodesWithParents(dragged);

    return this._eligibleTargets(draggedNodes, draggingGroup).map((node) => {
      const rect = this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(node.hostElement));

      return { node, rect: this._toCanvasRect(rect) };
    });
  }

  private _draggedNodes(): FNodeBase[] {
    return this._dragContext.draggableItems
      .find((x) => x instanceof MoveSummaryDragHandler)
      ?.allDraggedNodeHandlers.map((x) => x.nodeOrGroup) || [];
  }

  /**
   * Returns the list of dragged nodes extended with all of their parent nodes.
   *
   * This ensures that parent nodes are excluded from the potential drop targets,
   * since they already act as containers for the dragged elements.
   */
  private _draggedNodesWithParents(nodes: FNodeBase[]): FNodeBase[] {
    return nodes.reduce((result: FNodeBase[], x: FNodeBase) => {
      result.push(x, ...this._mediator.execute<FNodeBase[]>(new GetParentNodesRequest(x)));

      return result;
    }, []);
  }

  private _eligibleTargets(dragged: FNodeBase[], draggingGroup: boolean): FNodeBase[] {
    const nonDragged = this._allNodesAndGroups.filter(x => !dragged.includes(x));

    return draggingGroup ? nonDragged.filter(x => x instanceof FGroupDirective) : nonDragged;
  }

  private _toCanvasRect(rect: IRect): IRect {
    return RectExtensions.initialize(
      rect.x * this._canvasTransform.scale + this._canvasPosition.x,
      rect.y * this._canvasTransform.scale + this._canvasPosition.y,
      rect.width * this._canvasTransform.scale,
      rect.height * this._canvasTransform.scale,
    );
  }
}
