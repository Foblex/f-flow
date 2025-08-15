import {inject, Injectable} from '@angular/core';
import {CreateMoveNodesDragModelFromSelectionRequest} from './create-move-nodes-drag-model-from-selection.request';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {FComponentsStore} from '../../../f-storage';
import {FDraggableDataContext} from '../../f-draggable-data-context';
import {MoveNodeOrGroupDragHandler} from '../move-node-or-group.drag-handler';
import {FNodeBase} from '../../../f-node';
import {PutOutputConnectionHandlersToArrayRequest} from './domain/put-output-connection-handlers-to-array';
import {
  PutInputConnectionHandlersToArrayRequest
} from './domain/put-input-connection-handlers-to-array';
import {
  GetDeepChildrenNodesAndGroupsRequest,
} from '../../../domain';
import {flatMap} from '@foblex/utils';
import {BaseConnectionDragHandler} from '../connection-drag-handlers';
import {MoveSummaryDragHandler} from '../move-summary.drag-handler';
import {BuildDragHierarchyRequest, BuildDragHierarchyResponse} from "./domain/build-drag-hierarchy";
import {CreateSummaryDragHandlerRequest} from "./domain/create-summary-drag-handler";

// This execution is responsible for creating a drag model for moving nodes based on the current selection.
@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, MoveSummaryDragHandler> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): MoveSummaryDragHandler {
    const selectedNodesAndGroups = this._collectSelectedNodesAndGroups(request.nodeWithDisabledSelection);
    const selectedNodesAndGroupsWithChildren = this._collectSelectedAndAllChildren(selectedNodesAndGroups);

    const dragHierarchy = this._buildDragHierarchy(selectedNodesAndGroupsWithChildren);

    this._setConnectionsHandlersToNodes(dragHierarchy.list, this._getAllOutputIds(selectedNodesAndGroupsWithChildren), this._getAllInputIds(selectedNodesAndGroupsWithChildren));

    return this._createSummaryDragHandler(dragHierarchy.roots);
  }

  private _collectSelectedNodesAndGroups(nodeWithDisabledSelection?: FNodeBase): FNodeBase[] {
    const result = this._getNodesFromSelection();
    if (nodeWithDisabledSelection) {
      result.push(nodeWithDisabledSelection);
    }
    return result;
  }

  private _getNodesFromSelection(): FNodeBase[] {
    return this._dragContext.selectedItems
      .map((x) => this._findNode(x.hostElement))
      .filter((x): x is FNodeBase => !!x);
  }

  private _findNode(hostElement: HTMLElement | SVGElement): FNodeBase | undefined {
    return this._store.fNodes
      .find(n => n.isContains(hostElement));
  }

  private _collectSelectedAndAllChildren(selectedNodesAndGroups: FNodeBase[]): FNodeBase[] {
    return selectedNodesAndGroups.reduce((result: FNodeBase[], x: FNodeBase) => {
      result.push(x);
      return result.concat(this._getChildrenNodes(x.fId()));
    }, []);
  }

  private _buildDragHierarchy(selectedNodesAndGroupsWithChildren: FNodeBase[]): BuildDragHierarchyResponse {
    return this._mediator.execute(new BuildDragHierarchyRequest(selectedNodesAndGroupsWithChildren));
  }

  private _getChildrenNodes(fId: string): FNodeBase[] {
    return this._mediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private _getAllOutputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeOutputIds(fNode));
  }

  private _getNodeOutputIds(fNode: FNodeBase): string[] {
    return this._store.fOutputs.filter((x) => fNode.fId() === x.fNodeId)
      .map((x) => x.fId);
  }

  private _getAllInputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeInputIds(fNode));
  }

  private _getNodeInputIds(fNode: FNodeBase): string[] {
    return this._store.fInputs.filter((x) => fNode.fId() === x.fNodeId)
      .map((x) => x.fId);
  }

  private _setConnectionsHandlersToNodes(
    dragHandlers: MoveNodeOrGroupDragHandler[], outputIds: string[], inputIds: string[]
  ): void {
    const existingConnectionHandlers: BaseConnectionDragHandler[] = [];
    dragHandlers.forEach((x) => {
      this._mediator.execute(new PutOutputConnectionHandlersToArrayRequest(x, inputIds, existingConnectionHandlers));
      this._mediator.execute(new PutInputConnectionHandlersToArrayRequest(x, outputIds, existingConnectionHandlers));
    });
  }

  private _createSummaryDragHandler(hierarchyRoots: MoveNodeOrGroupDragHandler[]): MoveSummaryDragHandler {
    return this._mediator.execute(new CreateSummaryDragHandlerRequest(hierarchyRoots));
  }
}
