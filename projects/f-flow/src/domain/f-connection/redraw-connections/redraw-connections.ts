import { ILine, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { CalculateConnectionLineByBehaviorRequest } from '../calculate-connection-line-by-behavior';
import { FConnectorBase } from '../../../f-connectors';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';
import { DragRectCache } from '../../drag-rect-cache';

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

  public handle(_request: RedrawConnectionsRequest): void {
    this._resetConnectors();

    if (this._store.fTempConnection) {
      this._createMarkers(this._store.fTempConnection);
    }

    if (this._store.fSnapConnection) {
      this._createMarkers(this._store.fSnapConnection);
    }

    this._store.fConnections.forEach((connection) => {
      this._setupConnection(
        this._getSourceConnector(connection.fOutputId()),
        this._getTargetConnector(connection.fInputId()),
        connection,
      );
    });
    DragRectCache.invalidateAll();
  }

  private _getSourceConnector(id: string): FConnectorBase {
    const result = this._store.fOutputs.find((x) => x.fId() === id);
    if (!result) {
      throw new Error(`Source connector with id ${id} not found`);
    }

    return result;
  }

  private _getTargetConnector(id: string): FConnectorBase {
    const result = this._store.fInputs.find((x) => x.fId() === id);
    if (!result) {
      throw new Error(`Target connector with id ${id} not found`);
    }

    return result;
  }

  private _resetConnectors(): void {
    this._store.fOutputs.forEach((x) => x.resetConnected());
    this._store.fInputs.forEach((x) => x.resetConnected());
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
    return this._mediator.execute(
      new CalculateConnectionLineByBehaviorRequest(
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
