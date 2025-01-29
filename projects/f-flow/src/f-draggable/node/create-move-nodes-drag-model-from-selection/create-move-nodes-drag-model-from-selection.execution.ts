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
import { CalculateNodeMoveRestrictionsRequest } from './domain/calculate-node-move-restrictions';
import { PutOutputConnectionHandlersToArrayRequest } from './domain/put-output-connection-handlers-to-array';
import {
  PutInputConnectionHandlersToArrayRequest
} from './domain/put-input-connection-handlers-to-array';
import { IsArrayHasParentNodeRequest } from '../../domain';
import { GetDeepChildrenNodesAndGroupsRequest, GetParentNodesRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';
import { CalculateCommonNodeMoveRestrictionsRequest } from './domain/calculate-common-node-move-restrictions';
import { IMinMaxPoint } from '@foblex/2d';
import { BaseConnectionDragHandler } from '../base-connection.drag-handler';

@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, IDraggableItem[]> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): IDraggableItem[] {
    const fItemsToDrag = this._getNodesWithRestrictions(
      this._getDraggedNodes(request.nodeWithDisabledSelection)
    );
    return this.getDragHandlersWithConnections(
      this._mapToNodeDragHandlers(fItemsToDrag),
      this.getAllOutputIds(fItemsToDrag),
      this.getAllInputIds(fItemsToDrag)
    );
  }

  private _getDraggedNodes(nodeWithDisabledSelection?: FNodeBase): FNodeBase[] {
    const result = this._getNodesFromSelection();
    if (nodeWithDisabledSelection) {
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
    return this._fComponentsStore.fNodes
      .find(n => n.isContains(hostElement));
  }

  private _getNodesWithRestrictions(fDraggedNodes: FNodeBase[]): INodeWithDistanceRestrictions[] {
    const result: INodeWithDistanceRestrictions[] = [];

    fDraggedNodes.forEach((x) => {
      const fParentNodes = this._fMediator.execute<FNodeBase[]>(new GetParentNodesRequest(x));
      const restrictions = this._getNodeMoveRestrictions(x, fParentNodes, fDraggedNodes);
      result.push({ fDraggedNode: x, fParentNodes, ...restrictions }, ...this._getChildrenItemsToDrag(x, restrictions));
    });

    this._applyCommonRestrictions(result);
    return result;
  }

  private _getNodeMoveRestrictions(fNode: FNodeBase, fParentNodes: FNodeBase[], fDraggedNodes: FNodeBase[]): IMinMaxPoint {
    return this._fMediator.execute<IMinMaxPoint>(
      new CalculateNodeMoveRestrictionsRequest(fNode, this._isParentNodeInArray(fParentNodes, fDraggedNodes))
    );
  }

  private _isParentNodeInArray(fParentNodes: FNodeBase[], fDraggedNodes: FNodeBase[]): boolean {
    return this._fMediator.execute<boolean>(new IsArrayHasParentNodeRequest(fParentNodes, fDraggedNodes))
  }

  private _getChildrenItemsToDrag(node: FNodeBase, restrictions: IMinMaxPoint): INodeWithDistanceRestrictions[] {
    return this._getChildrenNodes(node.fId).map((x) => ({ fDraggedNode: x, ...restrictions }));
  }

  private _getChildrenNodes(fId: string): FNodeBase[] {
    return this._fMediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private _applyCommonRestrictions(restrictions: INodeWithDistanceRestrictions[]): void {
    const commonRestrictions = this._fMediator.execute<IMinMaxPoint>(
      new CalculateCommonNodeMoveRestrictionsRequest(restrictions)
    );
    restrictions.forEach((x) => {
      x.min = commonRestrictions.min;
      x.max = commonRestrictions.max;
    });
  }

  private getAllOutputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getOutputsForNode(item.fDraggedNode).map((x) => x.fId));
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getAllInputIds(items: INodeWithDistanceRestrictions[]): string[] {
    return flatMap(items, (item: INodeWithDistanceRestrictions) => this.getInputsForNode(item.fDraggedNode).map((x) => x.fId));
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this._fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private _mapToNodeDragHandlers(items: INodeWithDistanceRestrictions[]): NodeDragHandler[] {
    return items.map((x) => new NodeDragHandler(
      x.fDraggedNode, { min: x.min, max: x.max })
    );
  }

  private getDragHandlersWithConnections(
    handlers: NodeDragHandler[], outputIds: string[], inputIds: string[]
  ): IDraggableItem[] {
    const fConnectionHandlers: BaseConnectionDragHandler[] = [];
    handlers.forEach((fNodeHandler) => {
      this._fMediator.execute(new PutOutputConnectionHandlersToArrayRequest(fNodeHandler, inputIds, fConnectionHandlers));
      this._fMediator.execute(new PutInputConnectionHandlersToArrayRequest(fNodeHandler, outputIds, fConnectionHandlers));
    });

    return handlers;
  }
}
