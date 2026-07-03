import { inject, Injectable } from '@angular/core';
import { AttachSoftParentConnectionDragHandlersToNodeRequest } from './attach-soft-parent-connection-drag-handlers-to-node-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../f-storage';
import { FNodeBase } from '../../../../f-node';
import { FConnectionBase } from '../../../../f-connection-v2';
import {
  DragNodeConnectionBothSidesHandler,
  DragNodeConnectionHandlerBase,
  DragNodeConnectionSourceHandler,
  DragNodeConnectionTargetHandler,
} from '../../drag-node-dependent-connection-handlers';
import { IParentConnectionHandlers } from '../../drag-node-handler';
import {
  FConnectorBase,
  getAllSourceConnectors,
  getAllTargetConnectors,
  requireSourceConnector,
  requireTargetConnector,
} from '../../../../f-connectors';
import { IRoundedRect } from '@foblex/2d';
import { GetConnectorRectReferenceRequest, IConnectorRectRef } from '../../../../domain';
import { DragHandlerInjector } from '../../../infrastructure';

@Injectable()
@FExecutionRegister(AttachSoftParentConnectionDragHandlersToNodeRequest)
export class AttachSoftParentConnectionDragHandlersToNode implements IExecution<
  AttachSoftParentConnectionDragHandlersToNodeRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _dragInjector = inject(DragHandlerInjector);

  public handle({
    dragHandler,
    constraints,
    handlerPool,
  }: AttachSoftParentConnectionDragHandlersToNodeRequest): void {
    const softParentsHandlers = constraints.soft.map((x) =>
      this._buildParentConnectionHandlers(x.nodeOrGroup, handlerPool),
    );
    dragHandler.setSoftParentConnectionHandlers(softParentsHandlers);
  }

  private _buildParentConnectionHandlers(
    parent: FNodeBase,
    handlerPool: DragNodeConnectionHandlerBase[],
  ): IParentConnectionHandlers {
    const outputConnectors = getAllSourceConnectors(this._store).filter(
      (x) => x.fNodeId === parent.fId(),
    );
    const inputConnectors = getAllTargetConnectors(this._store).filter(
      (x) => x.fNodeId === parent.fId(),
    );

    if (!outputConnectors.length && !inputConnectors.length) {
      return { source: [], target: [] };
    }

    const outputIds = new Set(outputConnectors.map((x) => x.fId()));
    const inputIds = new Set(inputConnectors.map((x) => x.fId()));
    const baselineRectByConnectorId = new Map<string, IRoundedRect>();

    const result: IParentConnectionHandlers = { source: [], target: [] };

    for (const connection of this._store.connections.getAll()) {
      const isSource = outputIds.has(connection.sourceId());
      const isTarget = inputIds.has(connection.targetId());
      if (!isSource && !isTarget) {
        continue;
      }

      let connectionHandler = this._getExistingConnectionHandler(handlerPool, connection);
      if (!connectionHandler) {
        connectionHandler = this._createConnectionHandler(connection, isSource, isTarget);
        handlerPool.push(connectionHandler);
      }

      if (isSource) {
        const sourceConnector = requireSourceConnector(this._store, connection.sourceId());
        result.source.push({
          handler: connectionHandler,
          connector: sourceConnector,
          baselineRect: this._readConnectorRect(sourceConnector, baselineRectByConnectorId),
        });
      }

      if (isTarget) {
        const targetConnector = requireTargetConnector(this._store, connection.targetId());
        result.target.push({
          handler: connectionHandler,
          connector: targetConnector,
          baselineRect: this._readConnectorRect(targetConnector, baselineRectByConnectorId),
        });
      }
    }

    return result;
  }

  private _getExistingConnectionHandler(
    existingConnectionHandlers: DragNodeConnectionHandlerBase[],
    connection: FConnectionBase,
  ): DragNodeConnectionHandlerBase | undefined {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }

  private _createConnectionHandler(
    connection: FConnectionBase,
    isSource: boolean,
    isTarget: boolean,
  ): DragNodeConnectionHandlerBase {
    let result: DragNodeConnectionHandlerBase;
    if (isSource && isTarget) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else if (isSource) {
      result = this._dragInjector.createInstance(DragNodeConnectionSourceHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionTargetHandler);
    }
    result.initialize(connection);

    return result;
  }

  private _readConnectorRect(
    connector: FConnectorBase,
    cache: Map<string, IRoundedRect>,
  ): IRoundedRect {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const rect = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(connector),
    ).rect;
    cache.set(cacheKey, rect);

    return rect;
  }
}
