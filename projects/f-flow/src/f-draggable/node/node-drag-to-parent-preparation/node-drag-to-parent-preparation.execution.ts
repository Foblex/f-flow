import { Injectable } from '@angular/core';
import { NodeDragToParentPreparationRequest } from './node-drag-to-parent-preparation.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { INodeWithRect } from '../../domain';
import { IRect } from '@foblex/2d';
import { GetElementRectInFlowRequest } from '../../../domain';
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

  constructor(
    private fMediator: FMediator,
    private fDraggableDataContext: FDraggableDataContext,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: NodeDragToParentPreparationRequest): void {
    const fNode = this.fComponentsStore.findNode(request.event.targetElement);
    if (!fNode) {
      throw new Error('Node not found');
    }


    this.fDraggableDataContext.draggableItems.push(
      new NodeDragToParentDragHandler(
        this.fMediator, this.fComponentsStore,
        this.fDraggableDataContext, this.getNotDraggedNodesRects()
      )
    );
  }

  private getNotDraggedNodesRects(): INodeWithRect[] {
    return this.getNotDraggedNodes(this.getDraggedNodes()).map((x) => {
      return {
        node: x,
        rect: this.fMediator.send<IRect>(new GetElementRectInFlowRequest(x.hostElement))
      }
    });
  }

  private getDraggedNodes(): FNodeBase[] {
    return this.fDraggableDataContext.draggableItems
      .filter((x) => x instanceof NodeDragHandler)
      .map((x) => (x as NodeDragHandler).fNode);
  }

  private getNotDraggedNodes(draggedNodes: FNodeBase[]): FNodeBase[] {
    return this.fNodes.filter((x) => !draggedNodes.includes(x));
  }
}
