import { ILine, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';
import { DragRectCache } from '../../drag-rect-cache';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  FConnectionBase,
} from '../../../f-connection-v2';

/**
 * Execution that redraws connections in the FComponentsStore.
 * It resets connectors, sets markers for temporary and snap connections,
 * and sets up connections based on the stored outputs and inputs.
 */
@Injectable()
@FExecutionRegister(RedrawConnectionsRequest)
export class RedrawConnections implements IExecution<RedrawConnectionsRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _connectionBehaviour = inject(ConnectionBehaviourBuilder);

  public handle(_request: RedrawConnectionsRequest): void {
    this._resetConnectors();

    const instanceForCreate = this._store.connections.getForCreate<FConnectionBase>();
    if (instanceForCreate) {
      this._createMarkers(instanceForCreate);
    }

    const instanceForSnap = this._store.connections.getForSnap<FConnectionBase>();
    if (instanceForSnap) {
      this._createMarkers(instanceForSnap);
    }

    this._store.connections.getAll<FConnectionBase>().forEach((connection) => {
      this._setupConnection(
        this._getSourceConnector(connection.fOutputId()),
        this._getTargetConnector(connection.fInputId()),
        connection,
      );
    });
    DragRectCache.invalidateAll();
  }

  private _getSourceConnector(id: string): FConnectorBase {
    return this._store.outputs.require(id);
  }

  private _getTargetConnector(id: string): FConnectorBase {
    return this._store.inputs.require(id);
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

  private _calculateConnectorRect(connector: FConnectorBase): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(connector.hostElement),
    );
  }

  private _createMarkers(connection: FConnectionBase): void {
    this._mediator.execute(new CreateConnectionMarkersRequest(connection));
  }
}
