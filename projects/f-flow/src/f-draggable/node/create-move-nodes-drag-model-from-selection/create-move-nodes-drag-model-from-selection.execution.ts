import { inject, Injectable } from '@angular/core';
import { CreateMoveNodesDragModelFromSelectionRequest } from './create-move-nodes-drag-model-from-selection.request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { IDraggableItem } from '../../i-draggable-item';
import { NodeDragHandler } from '../node.drag-handler';
import { FNodeBase } from '../../../f-node';
import { CalculateNodeMoveLimitsRequest } from './domain/calculate-node-move-limits';
import { PutOutputConnectionHandlersToArrayRequest } from './domain/put-output-connection-handlers-to-array';
import {
  PutInputConnectionHandlersToArrayRequest
} from './domain/put-input-connection-handlers-to-array';
import { IsArrayHasParentNodeRequest } from '../../domain';
import {
  GetDeepChildrenNodesAndGroupsRequest,
  GetNormalizedElementRectRequest,
  GetParentNodesRequest
} from '../../../domain';
import { flatMap } from '@foblex/utils';
import { CalculateCommonNodeMoveLimitsRequest } from './domain/calculate-common-node-move-limits';
import { IMinMaxPoint, IRect, RectExtensions } from '@foblex/2d';
import { BaseConnectionDragHandler } from '../connection-drag-handlers';
import { SummaryNodeDragHandler } from '../summary-node.drag-handler';
import { INodeMoveLimitsAndPosition } from './i-node-move-limits-and-position';
import { INodeMoveLimits } from './i-node-move-limits';

@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, SummaryNodeDragHandler> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): SummaryNodeDragHandler {
    const fDraggedNodes = this._getDraggedNodes(request.nodeWithDisabledSelection);

    const fNodesToDrag = this._getNodesToDragWithCommonLimits(fDraggedNodes);

    const fDragHandlers = this._mapToNodeDragHandlers(fNodesToDrag);

    this._setConnectionsHandlersToNodes(fDragHandlers, this._getAllOutputIds(fNodesToDrag), this._getAllInputIds(fNodesToDrag));

    const commonLimits = this._calculateCommonLimits(
      this._getNodesMoveLimits(fNodesToDrag, [], fDraggedNodes)
    );

    return new SummaryNodeDragHandler(
      commonLimits, fDragHandlers, this._getDraggedNodesBoundingRect(fNodesToDrag)
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

  private _getNodesToDragWithCommonLimits(fDraggedNodes: FNodeBase[]): FNodeBase[] {
    return fDraggedNodes.reduce((result: FNodeBase[], x: FNodeBase) => {
      result.push(x);
      return result.concat(this._getChildrenNodes(x.fId));
    }, []);
  }

  private _getNodesMoveLimits(fNodes: FNodeBase[], fParentNodes: FNodeBase[], fDraggedNodes: FNodeBase[]): INodeMoveLimitsAndPosition[] {
    return fDraggedNodes.map((x) => {
      const fParentNodes = this._fMediator.execute<FNodeBase[]>(new GetParentNodesRequest(x));
      return { position: x.position, ...this._getNodeMoveLimits(x, fParentNodes, fDraggedNodes) };
    });
  }

  private _getNodeMoveLimits(fNode: FNodeBase, fParentNodes: FNodeBase[], fDraggedNodes: FNodeBase[]): INodeMoveLimits {
    return this._fMediator.execute<IMinMaxPoint>(
      new CalculateNodeMoveLimitsRequest(fNode, this._isParentNodeInArray(fParentNodes, fDraggedNodes))
    );
  }

  private _isParentNodeInArray(fParentNodes: FNodeBase[], fDraggedNodes: FNodeBase[]): boolean {
    return this._fMediator.execute<boolean>(new IsArrayHasParentNodeRequest(fParentNodes, fDraggedNodes))
  }

  private _getChildrenNodes(fId: string): FNodeBase[] {
    return this._fMediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private _calculateCommonLimits(limits: INodeMoveLimitsAndPosition[]): IMinMaxPoint {
    return this._fMediator.execute<IMinMaxPoint>(
      new CalculateCommonNodeMoveLimitsRequest(limits)
    );
  }

  private _getAllOutputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeOutputIds(fNode));
  }

  private _getNodeOutputIds(fNode: FNodeBase): string[] {
    return this._fComponentsStore.fOutputs.filter((x) => fNode.fId === x.fNodeId)
      .map((x) => x.fId);
  }

  private _getAllInputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeInputIds(fNode));
  }

  private _getNodeInputIds(fNode: FNodeBase): string[] {
    return this._fComponentsStore.fInputs.filter((x) => fNode.fId === x.fNodeId)
      .map((x) => x.fId);
  }

  private _mapToNodeDragHandlers(items: FNodeBase[]): NodeDragHandler[] {
    return items.map((x) => new NodeDragHandler(x));
  }

  private _setConnectionsHandlersToNodes(
    handlers: NodeDragHandler[], outputIds: string[], inputIds: string[]
  ): void {
    const fConnectionHandlers: BaseConnectionDragHandler[] = [];
    handlers.forEach((fNodeHandler) => {
      this._fMediator.execute(new PutOutputConnectionHandlersToArrayRequest(fNodeHandler, inputIds, fConnectionHandlers));
      this._fMediator.execute(new PutInputConnectionHandlersToArrayRequest(fNodeHandler, outputIds, fConnectionHandlers));
    });
  }

  private _getDraggedNodesBoundingRect(fNodes: FNodeBase[]): IRect {
    return RectExtensions.union(fNodes.map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    })) || RectExtensions.initialize();
  }
}
