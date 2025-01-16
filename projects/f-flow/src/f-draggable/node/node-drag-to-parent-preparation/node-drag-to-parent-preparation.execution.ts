import { Injectable } from '@angular/core';
import { NodeDragToParentPreparationRequest } from './node-drag-to-parent-preparation.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { IPoint, IRect, ITransformModel, PointExtensions, RectExtensions } from '@foblex/2d';
import { GetNormalizedElementRectRequest, GetParentNodesRequest } from '../../../domain';
import { FNodeBase } from '../../../f-node';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';
import { NodeDragHandler } from '../node.drag-handler';

@Injectable()
@FExecutionRegister(NodeDragToParentPreparationRequest)
export class NodeDragToParentPreparationExecution
  implements IExecution<NodeDragToParentPreparationRequest, void> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private get fCanvasPosition(): IPoint {
    return PointExtensions.sum(this.transform.position, this.transform.scaledPosition)
  }

  constructor(
    private fMediator: FMediator,
    private fDraggableDataContext: FDraggableDataContext,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: NodeDragToParentPreparationRequest): void {
    const fNode = this.fComponentsStore
      .fNodes.find(n => n.isContains(request.event.targetElement));
    if (!fNode) {
      throw new Error('Node not found');
    }

    this.fDraggableDataContext.draggableItems.push(
      new NodeDragToParentDragHandler(
        this.fComponentsStore,
        this.fDraggableDataContext, this._getNotDraggedNodesRects()
      )
    );
  }

  private _getNotDraggedNodesRects(): INodeWithRect[] {
    const draggedNodes = this._addParentNodes(this._getNodesBeingDragged());
    return this._getNotDraggedNodes(draggedNodes).map((x) => {
      const rect = this.fMediator.send<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
      return {
        node: x,
        rect: RectExtensions.initialize(
          rect.x + this.fCanvasPosition.x,
          rect.y + this.fCanvasPosition.y,
          rect.width * this.transform.scale,
          rect.height * this.transform.scale
        )
      }
    });
  }

  private _getNodesBeingDragged(): FNodeBase[] {
    return this.fDraggableDataContext.draggableItems
      .filter((x) => x instanceof NodeDragHandler)
      .map((x) => x.fNode);
  }

  private _addParentNodes(fNodes: FNodeBase[]): FNodeBase[] {
    return fNodes.reduce((result: FNodeBase[], x: FNodeBase) => {
      result.push(x, ...this.fMediator.send<FNodeBase[]>(new GetParentNodesRequest(x)));
      return result;
    }, []);
  }

  private _getNotDraggedNodes(draggedNodes: FNodeBase[]): FNodeBase[] {
    return this.fNodes.filter((x) => !draggedNodes.includes(x));
  }
}
