import { inject, Injectable } from '@angular/core';
import { AttachDragNodeHandlerFromSelectionRequest } from './attach-drag-node-handler-from-selection-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { MoveDragHandler } from '../move-drag-handler';
import { FNodeBase } from '../../../f-node';
import { AttachSourceConnectionDragHandlersToNodeRequest } from './attach-source-connection-drag-handlers-to-node';
import { AttachTargetConnectionDragHandlersToNodeRequest } from './attach-target-connection-drag-handlers-to-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';
import { DragNodeConnectionHandlerBase } from '../drag-node-dependent-connection-handlers';
import { MoveSummaryDragHandler } from '../move-summary-drag-handler';
import { CreateDragNodeHierarchyRequest, DragNodeHierarchy } from './create-drag-node-hierarchy';
import { CreateDragNodeSummaryHandlerRequest } from './create-drag-node-summary-handler';

// This execution is responsible for creating a drag model for moving nodes based on the current selection.
@Injectable()
@FExecutionRegister(AttachDragNodeHandlerFromSelectionRequest)
export class AttachDragNodeHandlerFromSelection
  implements IExecution<AttachDragNodeHandlerFromSelectionRequest, MoveSummaryDragHandler>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle({
    nodeWithDisabledSelection,
  }: AttachDragNodeHandlerFromSelectionRequest): MoveSummaryDragHandler {
    const selected = this._collectSelected(nodeWithDisabledSelection);
    const selectedWithChildren = this._withDeepChildren(selected);

    const hierarchy = this._mediator.execute<DragNodeHierarchy>(
      new CreateDragNodeHierarchyRequest(selectedWithChildren),
    );

    const selectedSourceConnectorIds = this._collectSourceConnectorIds(selectedWithChildren);
    const selectedTargetConnectorIds = this._collectTargetConnectorIds(selectedWithChildren);

    this._attachConnectionHandlers(
      hierarchy.participants,
      selectedSourceConnectorIds,
      selectedTargetConnectorIds,
    );

    return this._mediator.execute(
      new CreateDragNodeSummaryHandlerRequest(hierarchy.rootHandlers, hierarchy.participants),
    );
  }

  private _collectSelected(nodeWithDisabledSelection?: FNodeBase): FNodeBase[] {
    const result: FNodeBase[] = [];

    for (const item of this._dragSession.selectedItems) {
      const node = this._findNodeByHost(item.hostElement);
      if (node) {
        result.push(node);
      }
    }

    if (nodeWithDisabledSelection) {
      result.push(nodeWithDisabledSelection);
    }

    return result;
  }

  private _findNodeByHost(host: HTMLElement | SVGElement): FNodeBase | undefined {
    return this._store.nodes.getAll().find((x) => x.isContains(host));
  }

  private _withDeepChildren(nodes: FNodeBase[]): FNodeBase[] {
    const result: FNodeBase[] = [];

    for (const node of nodes) {
      result.push(node);

      const children = this._mediator.execute<FNodeBase[]>(
        new GetDeepChildrenNodesAndGroupsRequest(node.fId()),
      );

      result.push(...children);
    }

    return result;
  }

  private _collectSourceConnectorIds(nodes: FNodeBase[]): string[] {
    return flatMap(nodes, (n) =>
      this._store.outputs
        .getAll()
        .filter((x) => x.fNodeId === n.fId())
        .map((x) => x.fId()),
    );
  }

  private _collectTargetConnectorIds(nodes: FNodeBase[]): string[] {
    return flatMap(nodes, (n) =>
      this._store.inputs
        .getAll()
        .filter((x) => x.fNodeId === n.fId())
        .map((x) => x.fId()),
    );
  }

  private _attachConnectionHandlers(
    participants: MoveDragHandler[],
    selectedSourceConnectorIds: string[],
    selectedTargetConnectorIds: string[],
  ): void {
    const handlerPool: DragNodeConnectionHandlerBase[] = [];

    for (const handler of participants) {
      // Source-side dragging depends on whether target side is inside selection
      this._mediator.execute(
        new AttachSourceConnectionDragHandlersToNodeRequest(
          handler,
          selectedTargetConnectorIds,
          handlerPool,
        ),
      );

      // Target-side dragging depends on whether source side is inside selection
      this._mediator.execute(
        new AttachTargetConnectionDragHandlersToNodeRequest(
          handler,
          selectedSourceConnectorIds,
          handlerPool,
        ),
      );
    }
  }
}
