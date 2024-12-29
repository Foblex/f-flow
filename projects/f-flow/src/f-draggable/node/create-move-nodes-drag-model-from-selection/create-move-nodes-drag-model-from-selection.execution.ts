import { Injectable } from '@angular/core';
import { CreateMoveNodesDragModelFromSelectionRequest } from './create-move-nodes-drag-model-from-selection.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { IDraggableItem } from '../../i-draggable-item';
import { NodeDragHandler } from '../node.drag-handler';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { INodeWithDistanceRestrictions } from './i-node-with-distance-restrictions';
import { GetNodeMoveRestrictionsRequest, INodeMoveRestrictions } from './domain/get-node-move-restrictions';
import { PutOutputConnectionHandlersToArrayRequest } from './domain/put-output-connection-handlers-to-array';
import {
  PutInputConnectionHandlersToArrayRequest
} from './domain/put-input-connection-handlers-to-array';
import { NodeResizeByChildDragHandler } from '../node-resize-by-child.drag-handler';
import { GetParentNodesRequest, IsArrayHasParentNodeRequest } from '../../domain';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';

@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, IDraggableItem[]> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator
  ) {
  }

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): IDraggableItem[] {
    const itemsToDrag = this.getNodesWithRestrictions(this.getSelectedNodes(request.nodeWithDisabledSelection));
    return this.getDragHandlersWithConnections(
      this.getDragHandlersFromNodes(itemsToDrag),
      this.getAllOutputIds(itemsToDrag),
      this.getAllInputIds(itemsToDrag)
    );
  }

  private getSelectedNodes(nodeWithDisabledSelection?: FNodeBase): FNodeBase[] {
    const result = this.fDraggableDataContext.selectedItems
      .map((x) => this._findNode(x.hostElement))
      .filter((x): x is FNodeBase => !!x);
    if(nodeWithDisabledSelection) {
      result.push(nodeWithDisabledSelection);
    }
    return result;
  }

  private _findNode(hostElement: HTMLElement | SVGElement): FNodeBase | undefined {
    return this.fComponentsStore.fNodes.find(n => n.isContains(hostElement));
  }

  private getNodesWithRestrictions(selectedNodes: FNodeBase[]): INodeWithDistanceRestrictions[] {
    const result: INodeWithDistanceRestrictions[] = [];

    selectedNodes.forEach((x) => {
      const hasParentNodeInSelected = this.fMediator.send<boolean>(new IsArrayHasParentNodeRequest(x, selectedNodes));
      const restrictions = this.fMediator.send<INodeMoveRestrictions>(new GetNodeMoveRestrictionsRequest(x, hasParentNodeInSelected));
      const parentNodes = this.fMediator.send<FNodeBase[]>(new GetParentNodesRequest(x));
      result.push({ node: x, parentNodes, ...restrictions }, ...this.getChildrenItemsToDrag(x, restrictions));
    });

    return result;
  }

  private getChildrenItemsToDrag(node: FNodeBase, restrictions: INodeMoveRestrictions): INodeWithDistanceRestrictions[] {
    return this.getChildrenNodes(node.fId).map((x) => ({ node: x, ...restrictions }));
  }

  private getChildrenNodes(fId: string): FNodeBase[] {
    return this.fMediator.send<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private getAllOutputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getOutputsForNode(item.node).map((x) => x.fId));
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getAllInputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getInputsForNode(item.node).map((x) => x.fId));
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private getDragHandlersFromNodes(items: INodeWithDistanceRestrictions[]): IDraggableItem[] {
    let result: IDraggableItem[] = [];

    items.forEach((node) => {
      result.push(
        new NodeDragHandler(this.fDraggableDataContext, node.node, node.min, node.max),
        ...(node.parentNodes || []).map(() => new NodeResizeByChildDragHandler(this.fDraggableDataContext))
      );
    });
    return result;
  }

  private getDragHandlersWithConnections(
    handlers: IDraggableItem[], outputIds: string[], inputIds: string[]
  ): IDraggableItem[] {
    let result: IDraggableItem[] = handlers;
    handlers.filter((x) => x instanceof NodeDragHandler).forEach((dragHandler) => {
      this.fMediator.send(new PutOutputConnectionHandlersToArrayRequest(dragHandler as NodeDragHandler, inputIds, result));
      this.fMediator.send(new PutInputConnectionHandlersToArrayRequest(dragHandler as NodeDragHandler, outputIds, result));
    });
    return result;
  }
}
