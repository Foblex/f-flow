import { ILine, IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  EFConnectableSide,
  FConnectionBase,
} from '../../../f-connection-v2';
import { BrowserService } from '@foblex/platform';
import { GetConnectorRectReferenceRequest, IConnectorRectRef } from '../../f-connectors';
import {
  FConnectionCalculationWorker,
  IConnectionWorkerRequestItem,
  IConnectionWorkerResultItem,
} from '../connection-calculation-worker';

const CHUNKED_REDRAW_THRESHOLD = 100;
const WORKER_REDRAW_THRESHOLD = 150;
const CONNECTIONS_PER_SLICE_LIMIT = 500;
const SLICE_BUDGET_MS = 6;
const WORKER_SUPPORTED_BEHAVIORS = new Set<string>(['fixed', 'fixed_center']);

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
  private readonly _connectionWorker = inject(FConnectionCalculationWorker);
  private readonly _browser = inject(BrowserService);

  private _renderTicket = 0;

  public handle(_request: RedrawConnectionsRequest): void {
    const renderTicket = ++this._renderTicket;
    this._resetConnectors();

    const instanceForCreate = this._store.connections.getForCreate();
    if (instanceForCreate) {
      this._createMarkers(instanceForCreate);
    }

    const instanceForSnap = this._store.connections.getForSnap();
    if (instanceForSnap) {
      this._createMarkers(instanceForSnap);
    }

    const connections = [...this._store.connections.getAll()];
    const connectorRectCache = new Map<string, IRoundedRect>();

    if (this._shouldUseWorker(connections.length)) {
      this._setupConnectionsUsingWorker(connections, connectorRectCache, renderTicket);

      return;
    }

    if (!this._shouldChunk(connections.length)) {
      for (const connection of connections) {
        if (!this._isCurrentRenderTicket(renderTicket)) {
          return;
        }

        this._setupConnection(connection, connectorRectCache);
      }

      return;
    }

    this._setupConnectionsChunked(connections, connectorRectCache, 0, renderTicket);
  }

  private _resetConnectors(): void {
    this._store.outputs.getAll().forEach((x) => x.resetConnected());
    this._store.inputs.getAll().forEach((x) => x.resetConnected());
  }

  private _setupConnection(
    connection: FConnectionBase,
    connectorRectCache: Map<string, IRoundedRect>,
  ): void {
    const { source, target } = this._readConnectionEndpoints(connection);
    const line = this._calculateConnectionLine(source, target, connection, connectorRectCache);

    this._setupConnectionWithLine(connection, source, target, line);
  }

  private _setupConnectionWithLine(
    connection: FConnectionBase,
    source: FConnectorBase,
    target: FConnectorBase,
    line: ILine,
  ): void {
    source.setConnected(target);
    target.setConnected(source);

    this._createMarkers(connection);
    connection.setLine(line);
    connection.initialize();
    connection.isSelected() ? connection.markAsSelected() : null;
  }

  private _calculateConnectionLine(
    source: FConnectorBase,
    target: FConnectorBase,
    connection: FConnectionBase,
    connectorRectCache: Map<string, IRoundedRect>,
  ): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._calculateConnectorRect(source, connectorRectCache),
        this._calculateConnectorRect(target, connectorRectCache),
        connection,
        source.fConnectableSide,
        target.fConnectableSide,
      ),
    );
  }

  private _calculateConnectorRect(
    connector: FConnectorBase,
    connectorRectCache: Map<string, IRoundedRect>,
  ): IRoundedRect {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = connectorRectCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const rect = this._mediator.execute<IConnectorRectRef>(
      new GetConnectorRectReferenceRequest(connector),
    ).rect;
    connectorRectCache.set(cacheKey, rect);

    return rect;
  }

  private _createMarkers(connection: FConnectionBase): void {
    this._mediator.execute(new CreateConnectionMarkersRequest(connection));
  }

  private _readConnectionEndpoints(connection: FConnectionBase): {
    source: FConnectorBase;
    target: FConnectorBase;
  } {
    return {
      source: this._store.outputs.require(connection.fOutputId()),
      target: this._store.inputs.require(connection.fInputId()),
    };
  }

  private _setupConnectionsUsingWorker(
    connections: readonly FConnectionBase[],
    connectorRectCache: Map<string, IRoundedRect>,
    renderTicket: number,
  ): void {
    const payload = this._buildWorkerPayload(connections, connectorRectCache);
    const hasSupportedBehavior = payload.some((item) =>
      WORKER_SUPPORTED_BEHAVIORS.has(item.behavior),
    );
    if (!hasSupportedBehavior) {
      this._setupConnectionsChunked(connections, connectorRectCache, 0, renderTicket);

      return;
    }

    this._connectionWorker
      .calculate(payload)
      .then((results) => {
        if (!this._isCurrentRenderTicket(renderTicket)) {
          return;
        }

        this._applyWorkerResultsChunked(connections, results, connectorRectCache, 0, renderTicket);
      })
      .catch(() => {
        if (!this._isCurrentRenderTicket(renderTicket)) {
          return;
        }

        this._setupConnectionsChunked(connections, connectorRectCache, 0, renderTicket);
      });
  }

  private _buildWorkerPayload(
    connections: readonly FConnectionBase[],
    connectorRectCache: Map<string, IRoundedRect>,
  ): IConnectionWorkerRequestItem[] {
    const payload: IConnectionWorkerRequestItem[] = [];

    for (let index = 0; index < connections.length; index++) {
      const connection = connections[index];
      const { source, target } = this._readConnectionEndpoints(connection);
      const sourceRect = this._calculateConnectorRect(source, connectorRectCache);
      const targetRect = this._calculateConnectorRect(target, connectorRectCache);

      payload.push({
        index,
        behavior: connection.fBehavior,
        outputSide: connection.fOutputSide(),
        inputSide: connection.fInputSide(),
        sourceConnectableSide: source.fConnectableSide,
        targetConnectableSide: target.fConnectableSide,
        sourceRect: {
          x: sourceRect.x,
          y: sourceRect.y,
          width: sourceRect.width,
          height: sourceRect.height,
        },
        targetRect: {
          x: targetRect.x,
          y: targetRect.y,
          width: targetRect.width,
          height: targetRect.height,
        },
      });
    }

    return payload;
  }

  private _applyWorkerResultsChunked(
    connections: readonly FConnectionBase[],
    results: readonly IConnectionWorkerResultItem[],
    connectorRectCache: Map<string, IRoundedRect>,
    startIndex: number,
    renderTicket: number,
  ): void {
    if (!this._isCurrentRenderTicket(renderTicket)) {
      return;
    }

    const sliceStart = this._now();
    let endIndex = startIndex;
    let processed = 0;

    while (
      endIndex < connections.length &&
      processed < CONNECTIONS_PER_SLICE_LIMIT &&
      this._isWithinSliceBudget(sliceStart)
    ) {
      const connection = connections[endIndex];
      const result = results[endIndex];

      if (this._isWorkerResultSupported(result)) {
        try {
          const { source, target } = this._readConnectionEndpoints(connection);
          connection._applyResolvedSidesToConnection(
            result.sourceSide as EFConnectableSide,
            result.targetSide as EFConnectableSide,
          );
          this._setupConnectionWithLine(connection, source, target, result.line);
        } catch {
          this._setupConnection(connection, connectorRectCache);
        }
      } else {
        this._setupConnection(connection, connectorRectCache);
      }

      endIndex++;
      processed++;

      if (!this._isCurrentRenderTicket(renderTicket)) {
        return;
      }
    }

    if (endIndex >= connections.length) {
      return;
    }

    this._requestAnimationFrame(() =>
      this._applyWorkerResultsChunked(
        connections,
        results,
        connectorRectCache,
        endIndex,
        renderTicket,
      ),
    );
  }

  private _isWorkerResultSupported(
    result: IConnectionWorkerResultItem | undefined,
  ): result is IConnectionWorkerResultItem & {
    sourceSide: string;
    targetSide: string;
    line: ILine;
  } {
    return !!(result?.supported && result.sourceSide && result.targetSide && result.line);
  }

  private _setupConnectionsChunked(
    connections: readonly FConnectionBase[],
    connectorRectCache: Map<string, IRoundedRect>,
    startIndex: number,
    renderTicket: number,
  ): void {
    if (!this._isCurrentRenderTicket(renderTicket)) {
      return;
    }

    const sliceStart = this._now();
    let endIndex = startIndex;
    let processed = 0;

    while (
      endIndex < connections.length &&
      processed < CONNECTIONS_PER_SLICE_LIMIT &&
      this._isWithinSliceBudget(sliceStart)
    ) {
      this._setupConnection(connections[endIndex], connectorRectCache);
      endIndex++;
      processed++;

      if (!this._isCurrentRenderTicket(renderTicket)) {
        return;
      }
    }

    if (endIndex >= connections.length) {
      return;
    }

    this._requestAnimationFrame(() =>
      this._setupConnectionsChunked(connections, connectorRectCache, endIndex, renderTicket),
    );
  }

  private _shouldChunk(connectionCount: number): boolean {
    return this._browser.isBrowser() && connectionCount >= CHUNKED_REDRAW_THRESHOLD;
  }

  private _shouldUseWorker(connectionCount: number): boolean {
    return (
      connectionCount >= WORKER_REDRAW_THRESHOLD &&
      this._browser.isBrowser() &&
      this._connectionWorker.isEnabled()
    );
  }

  private _isCurrentRenderTicket(renderTicket: number): boolean {
    return renderTicket === this._renderTicket;
  }

  private _requestAnimationFrame(callback: () => void): void {
    const windowRef = this._browser.document.defaultView;
    if (!windowRef) {
      callback();

      return;
    }

    windowRef.requestAnimationFrame(callback);
  }

  private _now(): number {
    const performanceRef = this._browser.document.defaultView?.performance;

    return performanceRef ? performanceRef.now() : Date.now();
  }

  private _isWithinSliceBudget(sliceStart: number): boolean {
    if (!this._browser.isBrowser()) {
      return true;
    }

    return this._now() - sliceStart < SLICE_BUDGET_MS;
  }
}
