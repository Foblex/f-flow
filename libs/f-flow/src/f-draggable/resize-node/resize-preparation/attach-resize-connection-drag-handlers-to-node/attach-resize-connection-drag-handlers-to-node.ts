import { inject, Injectable } from '@angular/core';
import { AttachResizeConnectionDragHandlersToNodeRequest } from './attach-resize-connection-drag-handlers-to-node-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import {
  getAllSourceConnectors,
  getAllTargetConnectors,
  requireSourceConnector,
  requireTargetConnector,
} from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { FConnectionBase } from '../../../../f-connection-v2';
import {
  ResizeNodeConnectionBothSidesHandler,
  ResizeNodeConnectionHandlerBase,
  ResizeNodeConnectionSourceHandler,
  ResizeNodeConnectionTargetHandler,
} from '../../resize-node-handler';
import { IRect } from '@foblex/2d';
import { GetNormalizedElementRectRequest } from '../../../../domain';
import { DragHandlerInjector } from '../../../infrastructure';
import { CalculateResizeLimitsRequest } from '../../calculate-resize-limits';
import { IResizeNodeConnectionHandlers } from '../../resize-node-handler';
import { IResizeConstraint, IResizeLimit } from '../../constraint';

@Injectable()
@FExecutionRegister(AttachResizeConnectionDragHandlersToNodeRequest)
export class AttachResizeConnectionDragHandlersToNode implements IExecution<
  AttachResizeConnectionDragHandlersToNodeRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _dragInjector = inject(DragHandlerInjector);

  public handle({ handler, nodeOrGroup }: AttachResizeConnectionDragHandlersToNodeRequest): void {
    const softParents = this._readSoftParents(nodeOrGroup);
    const involvedNodes = [nodeOrGroup, ...softParents];

    const involvedSourceIds = this._collectSourceConnectorIds(involvedNodes);
    const involvedTargetIds = this._collectTargetConnectorIds(involvedNodes);
    const connectionHandlerPool = new Map<string, ResizeNodeConnectionHandlerBase>();

    handler.setNodeConnectionHandlers(
      this._buildConnectionHandlersForNode(
        nodeOrGroup,
        involvedSourceIds,
        involvedTargetIds,
        connectionHandlerPool,
      ),
    );

    handler.setSoftParentConnectionHandlers(
      softParents.map((parent) =>
        this._buildConnectionHandlersForNode(
          parent,
          involvedSourceIds,
          involvedTargetIds,
          connectionHandlerPool,
        ),
      ),
    );
  }

  private _readSoftParents(nodeOrGroup: FNodeBase): FNodeBase[] {
    const baselineRect = this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(nodeOrGroup.hostElement),
    );
    const constraints = this._mediator.execute<IResizeConstraint>(
      new CalculateResizeLimitsRequest(nodeOrGroup, baselineRect),
    );

    return constraints.limits.softLimits.map((x: IResizeLimit) => x.nodeOrGroup);
  }

  private _collectSourceConnectorIds(nodes: FNodeBase[]): Set<string> {
    const nodeIds = new Set(nodes.map((x) => x.fId()));

    return new Set(
      getAllSourceConnectors(this._store)
        .filter((x) => nodeIds.has(x.fNodeId))
        .map((x) => x.fId()),
    );
  }

  private _collectTargetConnectorIds(nodes: FNodeBase[]): Set<string> {
    const nodeIds = new Set(nodes.map((x) => x.fId()));

    return new Set(
      getAllTargetConnectors(this._store)
        .filter((x) => nodeIds.has(x.fNodeId))
        .map((x) => x.fId()),
    );
  }

  private _buildConnectionHandlersForNode(
    nodeOrGroup: FNodeBase,
    involvedSourceIds: Set<string>,
    involvedTargetIds: Set<string>,
    connectionHandlerPool: Map<string, ResizeNodeConnectionHandlerBase>,
  ): IResizeNodeConnectionHandlers {
    const outputs = getAllSourceConnectors(this._store).filter(
      (x) => x.fNodeId === nodeOrGroup.fId(),
    );
    const inputs = getAllTargetConnectors(this._store).filter(
      (x) => x.fNodeId === nodeOrGroup.fId(),
    );

    if (!outputs.length && !inputs.length) {
      return { source: [], target: [] };
    }

    const outputIds = new Set(outputs.map((x) => x.fId()));
    const inputIds = new Set(inputs.map((x) => x.fId()));

    const result: IResizeNodeConnectionHandlers = { source: [], target: [] };

    for (const connection of this._store.connections.getAll()) {
      const isSource = outputIds.has(connection.sourceId());
      const isTarget = inputIds.has(connection.targetId());
      if (!isSource && !isTarget) {
        continue;
      }

      const connectionHandler =
        connectionHandlerPool.get(connection.fId()) ??
        this._createConnectionHandler(connection, involvedSourceIds, involvedTargetIds);
      connectionHandlerPool.set(connection.fId(), connectionHandler);

      if (isSource) {
        const sourceConnector = requireSourceConnector(this._store, connection.sourceId());
        result.source.push({
          handler: connectionHandler,
          connector: sourceConnector,
        });
      }

      if (isTarget) {
        const targetConnector = requireTargetConnector(this._store, connection.targetId());
        result.target.push({
          handler: connectionHandler,
          connector: targetConnector,
        });
      }
    }

    return result;
  }

  private _createConnectionHandler(
    connection: FConnectionBase,
    involvedSourceIds: Set<string>,
    involvedTargetIds: Set<string>,
  ): ResizeNodeConnectionHandlerBase {
    const isSource = involvedSourceIds.has(connection.sourceId());
    const isTarget = involvedTargetIds.has(connection.targetId());

    const result =
      isSource && isTarget
        ? this._dragInjector.createInstance(ResizeNodeConnectionBothSidesHandler)
        : isSource
          ? this._dragInjector.createInstance(ResizeNodeConnectionSourceHandler)
          : this._dragInjector.createInstance(ResizeNodeConnectionTargetHandler);

    result.initialize(connection);

    return result;
  }
}
