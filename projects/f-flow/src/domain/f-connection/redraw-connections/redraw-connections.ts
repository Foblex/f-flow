import { ILine, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';
import { FGeometryCache } from '../../f-geometry-cache';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  FConnectionBase,
} from '../../../f-connection-v2';

/**
 * Execution that redraws connections in the FComponentsStore.
 * It resets connectors, sets markers for temporary and snap connections,
 * and sets up connections based on the stored outputs and inputs.
 *
 * Connector rects are resolved via FGeometryCache when available and fresh,
 * falling back to a direct DOM measurement otherwise.
 * After each full redraw cycle all cache entries are refreshed so the next
 * drag session can start without any DOM reads (zero-cost ensureFresh).
 */
@Injectable()
@FExecutionRegister(RedrawConnectionsRequest)
export class RedrawConnections implements IExecution<RedrawConnectionsRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  private readonly _geometryCache = inject(FGeometryCache);

  public handle(_request: RedrawConnectionsRequest): void {
    this._resetConnectors();

    const instanceForCreate = this._store.connections.getForCreate();
    if (instanceForCreate) {
      this._createMarkers(instanceForCreate);
    }

    const instanceForSnap = this._store.connections.getForSnap();
    if (instanceForSnap) {
      this._createMarkers(instanceForSnap);
    }

    this._store.connections.getAll().forEach((connection) => {
      this._setupConnection(
        this._store.outputs.require(connection.fOutputId()),
        this._store.inputs.require(connection.fInputId()),
        connection,
      );
    });
  }

  private _resetConnectors(): void {
    this._store.outputs.getAll().forEach((x) => x.resetConnected());
    this._store.inputs.getAll().forEach((x) => x.resetConnected());
  }

  private _setupConnection(
    source: FConnectorBase,
    target: FConnectorBase,
    connection: FConnectionBase,
  ): void {
    source.setConnected(target);
    target.setConnected(source);

    this._createMarkers(connection);

    connection.setLine(this._calculateConnectionLine(source, target, connection));

    connection.initialize();
    connection.isSelected() ? connection.markAsSelected() : null;
  }

  private _calculateConnectionLine(
    source: FConnectorBase,
    target: FConnectorBase,
    connection: FConnectionBase,
  ): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._calculateConnectorRect(source),
        this._calculateConnectorRect(target),
        connection,
        source.fConnectableSide,
        target.fConnectableSide,
      ),
    );
  }

  /**
   * Returns the connector rect from the geometry cache when fresh,
   * or measures it from the DOM and stores it in the cache for future drag sessions.
   */
  private _calculateConnectorRect(connector: FConnectorBase): IRoundedRect {
    const connectorId = connector.fId();
    const nodeId = this._geometryCache.getConnectorNodeId(connectorId);

    // Use the cached rect only when both the entry exists and the owning node is fresh.
    if (nodeId && !this._geometryCache.isNodeStale(nodeId)) {
      const cached = this._geometryCache.getConnectorRect(connectorId);
      if (cached) {
        return cached;
      }
    }

    // Cache is absent or stale — measure from DOM and refresh the cache entry.
    const rect = this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(connector.hostElement),
    );
    this._geometryCache.setConnectorRect(connectorId, rect);

    return rect;
  }

  private _createMarkers(connection: FConnectionBase): void {
    this._mediator.execute(new CreateConnectionMarkersRequest(connection));
  }
}
