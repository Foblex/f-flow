import { inject, Injectable } from '@angular/core';
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
import { IsArrayHasParentNodeRequest } from '../../domain';
import { GetDeepChildrenNodesAndGroupsRequest, GetParentNodesRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';

@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, IDraggableItem[]> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): IDraggableItem[] {
    const itemsToDrag = this._getNodesWithRestrictions(
      this._getSelectedNodes(request.nodeWithDisabledSelection)
    );
    return this.getDragHandlersWithConnections(
      this.getDragHandlersFromNodes(itemsToDrag),
      this.getAllOutputIds(itemsToDrag),
      this.getAllInputIds(itemsToDrag)
    );
  }

  private _getSelectedNodes(nodeWithDisabledSelection?: FNodeBase): FNodeBase[] {
    const result = this._getNodesFromSelection();
    if(nodeWithDisabledSelection) {
      result.push(nodeWithDisabledSelection);
    }
    return result;
  }

  private _getNodesFromSelection(): FNodeBase[] {
    return this._fDraggableDataContext.selectedItems
      .map((x) => this._findNode(x.hostElement))
      .filter((x): x is FNodeBase => !!x);
  }

  private _findNode(hostElement: HTMLElement | SVGElement): FNodeBase | undefined {
    return this._fComponentsStore.fNodes.find(n => n.isContains(hostElement));
  }

  private _getNodesWithRestrictions(nodesToDrag: FNodeBase[]): INodeWithDistanceRestrictions[] {
    const result: INodeWithDistanceRestrictions[] = [];

    nodesToDrag.forEach((x) => {
      const hasParentNodeInSelected = this._fMediator.send<boolean>(new IsArrayHasParentNodeRequest(x, nodesToDrag));
      const restrictions = this._fMediator.send<INodeMoveRestrictions>(new GetNodeMoveRestrictionsRequest(x, hasParentNodeInSelected));
      const parentNodes = this._fMediator.send<FNodeBase[]>(new GetParentNodesRequest(x));
      result.push({ node: x, parentNodes, ...restrictions }, ...this.getChildrenItemsToDrag(x, restrictions));
    });

    return result;
  }

  private getChildrenItemsToDrag(node: FNodeBase, restrictions: INodeMoveRestrictions): INodeWithDistanceRestrictions[] {
    return this.getChildrenNodes(node.fId).map((x) => ({ node: x, ...restrictions }));
  }

  private getChildrenNodes(fId: string): FNodeBase[] {
    return this._fMediator.send<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private getAllOutputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getOutputsForNode(item.node).map((x) => x.fId));
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getAllInputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getInputsForNode(item.node).map((x) => x.fId));
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private getDragHandlersFromNodes(items: INodeWithDistanceRestrictions[]): IDraggableItem[] {
    let result: IDraggableItem[] = [];

    items.forEach((node) => {
      result.push(
        new NodeDragHandler(this._fComponentsStore, node.node, node.min, node.max),
        ...(node.parentNodes || []).map(() => new NodeResizeByChildDragHandler(this._fDraggableDataContext))
      );
    });
    return result;
  }

  private getDragHandlersWithConnections(
    handlers: IDraggableItem[], outputIds: string[], inputIds: string[]
  ): IDraggableItem[] {
    let result: IDraggableItem[] = handlers;
    handlers.filter((x) => x instanceof NodeDragHandler).forEach((dragHandler) => {
      this._fMediator.send(new PutOutputConnectionHandlersToArrayRequest(dragHandler as NodeDragHandler, inputIds, result));
      this._fMediator.send(new PutInputConnectionHandlersToArrayRequest(dragHandler as NodeDragHandler, outputIds, result));
    });
    return result;
  }
}
