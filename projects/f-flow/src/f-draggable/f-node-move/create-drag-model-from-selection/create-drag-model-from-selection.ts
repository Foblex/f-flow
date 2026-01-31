import { inject, Injectable } from '@angular/core';
import { CreateDragModelFromSelectionRequest } from './create-drag-model-from-selection-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { MoveDragHandler } from '../move-drag-handler';
import { FNodeBase } from '../../../f-node';
import { CreateOutputConnectionHandlerAndSetToNodeHandlerRequest } from './create-output-connection-handler-and-set-to-node-handler';
import { CreateInputConnectionHandlerAndSetToNodeHandlerRequest } from './create-input-connection-handler-and-set-to-node-handler';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';
import { BaseConnectionDragHandler } from '../connection-drag-handlers';
import { MoveSummaryDragHandler } from '../move-summary-drag-handler';
import { BuildDragHierarchyRequest, BuildDragHierarchyResponse } from './build-drag-hierarchy';
import { CreateSummaryDragHandlerRequest } from './create-summary-drag-handler';

// This execution is responsible for creating a drag model for moving nodes based on the current selection.
@Injectable()
@FExecutionRegister(CreateDragModelFromSelectionRequest)
export class CreateDragModelFromSelection
  implements IExecution<CreateDragModelFromSelectionRequest, MoveSummaryDragHandler>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle({
    nodeWithDisabledSelection,
  }: CreateDragModelFromSelectionRequest): MoveSummaryDragHandler {
    const selected = this._collectSelectedNodesAndGroups(nodeWithDisabledSelection);
    const selectedWithChildren = this._collectSelectedAndAllChildren(selected);

    const hierarchy = this._buildDragHierarchy(selectedWithChildren);

    const outputIds = this._getAllOutputIds(selectedWithChildren);
    const inputIds = this._getAllInputIds(selectedWithChildren);

    this._attachConnectionHandlers(hierarchy.participants, outputIds, inputIds);

    return this._createSummaryDragHandler(hierarchy);
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
    return this._store.nodes.getAll<FNodeBase>().find((n) => n.isContains(hostElement));
  }

  private _collectSelectedAndAllChildren(selected: FNodeBase[]): FNodeBase[] {
    const result: FNodeBase[] = [];

    for (const node of selected) {
      result.push(node);
      result.push(...this._getChildrenNodes(node.fId()));
    }

    return result;
  }

  // selected nodes and groups including their children
  private _buildDragHierarchy(items: FNodeBase[]): BuildDragHierarchyResponse {
    return this._mediator.execute(new BuildDragHierarchyRequest(items));
  }

  private _getChildrenNodes(fId: string): FNodeBase[] {
    return this._mediator.execute<FNodeBase[]>(new GetDeepChildrenNodesAndGroupsRequest(fId));
  }

  private _getAllOutputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeOutputIds(fNode));
  }

  private _getNodeOutputIds(fNode: FNodeBase): string[] {
    return this._store.outputs
      .getAll()
      .filter((x) => fNode.fId() === x.fNodeId)
      .map((x) => x.fId());
  }

  private _getAllInputIds(fNodes: FNodeBase[]): string[] {
    return flatMap(fNodes, (fNode) => this._getNodeInputIds(fNode));
  }

  private _getNodeInputIds(fNode: FNodeBase): string[] {
    return this._store.fInputs.filter((x) => fNode.fId() === x.fNodeId).map((x) => x.fId());
  }

  private _attachConnectionHandlers(
    participants: MoveDragHandler[],
    outputIds: string[],
    inputIds: string[],
  ): void {
    const existing: BaseConnectionDragHandler[] = [];
    participants.forEach((handler) => {
      this._mediator.execute(
        new CreateOutputConnectionHandlerAndSetToNodeHandlerRequest(handler, inputIds, existing),
      );
      this._mediator.execute(
        new CreateInputConnectionHandlerAndSetToNodeHandlerRequest(handler, outputIds, existing),
      );
    });
  }

  private _createSummaryDragHandler(hierarchy: BuildDragHierarchyResponse): MoveSummaryDragHandler {
    return this._mediator.execute(
      new CreateSummaryDragHandlerRequest(hierarchy.dragRoots, hierarchy.participants),
    );
  }
}
