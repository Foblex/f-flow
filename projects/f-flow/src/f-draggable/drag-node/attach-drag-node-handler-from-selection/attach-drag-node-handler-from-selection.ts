import { inject, Injectable } from '@angular/core';
import { AttachDragNodeHandlerFromSelectionRequest } from './attach-drag-node-handler-from-selection-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { AttachSourceConnectionDragHandlersToNodeRequest } from './attach-source-connection-drag-handlers-to-node';
import { AttachTargetConnectionDragHandlersToNodeRequest } from './attach-target-connection-drag-handlers-to-node';
import { GetDeepChildrenNodesAndGroupsRequest } from '../../../domain';
import { flatMap } from '@foblex/utils';
import { DragNodeConnectionHandlerBase } from '../drag-node-dependent-connection-handlers';
import { DragNodeHandler, DragNodeItemHandler } from '../drag-node-handler';
import { CreateDragNodeHierarchyRequest, DragNodeHierarchy } from './create-drag-node-hierarchy';
import { CreateDragNodeHandlerRequest } from './create-drag-node-handler';
import { FGeometryCache } from '../../../domain/geometry-cache';

// This execution is responsible for creating a drag model for moving nodes based on the current selection.
@Injectable()
@FExecutionRegister(AttachDragNodeHandlerFromSelectionRequest)
export class AttachDragNodeHandlerFromSelection implements IExecution<
  AttachDragNodeHandlerFromSelectionRequest,
  DragNodeHandler
> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _geometryCache = inject(FGeometryCache);

  public handle({ nodeOrGroup }: AttachDragNodeHandlerFromSelectionRequest): DragNodeHandler {
    const selected = this._collectSelected(nodeOrGroup);
    const selectedWithChildren = this._withDeepChildren(selected);
    this._ensureGeometryFresh(selectedWithChildren);

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
      new CreateDragNodeHandlerRequest(hierarchy.rootHandlers, hierarchy.participants),
    );
  }

  private _ensureGeometryFresh(nodes: FNodeBase[]): void {
    const uniqueIds = new Set<string>();

    for (const node of nodes) {
      const nodeId = node.fId();
      if (uniqueIds.has(nodeId)) {
        continue;
      }

      uniqueIds.add(nodeId);
      this._geometryCache.ensureNodeGeometryFresh(nodeId);
    }
  }

  private _collectSelected(nodeOrGroup?: FNodeBase): FNodeBase[] {
    const result: FNodeBase[] = [];

    for (const item of this._dragSession.selectedItems) {
      const node = this._findNodeByHost(item.hostElement);
      if (node) {
        result.push(node);
      }
    }

    if (nodeOrGroup && !result.includes(nodeOrGroup)) {
      result.push(nodeOrGroup);
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
    participants: DragNodeItemHandler[],
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
