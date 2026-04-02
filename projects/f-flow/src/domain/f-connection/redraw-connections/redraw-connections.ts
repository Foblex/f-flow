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
  FConnectionContentBase,
} from '../../../f-connection-v2';
import { BrowserService } from '@foblex/platform';
import {
  CalculateConnectionsUsingConnectionWorkerRequest,
  IFConnectionWorkerConnectors,
  IFConnectionWorkerContext,
  IFConnectionWorkerResultItem,
  ResolveConnectionWorkerConnectorsRequest,
  ResolveConnectionWorkerContextRequest,
  ShouldUseConnectionWorkerRequest,
} from '../../../f-connection-worker';
import {
  ResolveConnectionEndpointRotationContextRequest,
  TResolveConnectionEndpointRotationContextResponse,
} from '../resolve-connection-endpoint-rotation-context';

const CONNECTIONS_PER_SLICE_LIMIT = 500;
const SLICE_BUDGET_MS = 6;

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
  private readonly _browser = inject(BrowserService);

  private _renderTicket = 0;
  private readonly _connectedInPreviousRender = new Set<FConnectorBase>();
  private readonly _connectionRenderCache = new WeakMap<
    FConnectionBase,
    { signature: string; pathElement: SVGElement }
  >();

  public handle(_request: RedrawConnectionsRequest): void {
    const renderTicket = ++this._renderTicket;
    const nodesRevision = this._store.nodesRevision;
    this._resetConnectedConnectors();

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
      this._setupConnectionsUsingWorker(
        connections,
        connectorRectCache,
        renderTicket,
        nodesRevision,
      );

      return;
    }
    this._setupConnectionsChunked(connections, connectorRectCache, 0, renderTicket, nodesRevision);
  }

  private _resetConnectedConnectors(): void {
    if (!this._connectedInPreviousRender.size) {
      return;
    }

    for (const connector of this._connectedInPreviousRender) {
      connector.resetConnected();
    }

    this._connectedInPreviousRender.clear();
  }

  private _setupConnection(connection: FConnectionBase, cache: Map<string, IRoundedRect>): void {
    const context = this._resolveConnectionContext(connection, cache);
    if (!context) {
      return;
    }

    const line = this._calculateConnectionLine(connection, context);

    this._setupConnectionWithLine(connection, context.source, context.target, line);
  }

  private _setupConnectionWithLine(
    connection: FConnectionBase,
    source: FConnectorBase,
    target: FConnectorBase,
    line: ILine,
  ): void {
    source.setConnected(target);
    target.setConnected(source);
    this._connectedInPreviousRender.add(source);
    this._connectedInPreviousRender.add(target);

    const markersChanged = this._createMarkers(connection);
    if (!markersChanged && !this._shouldRedrawConnection(connection, line)) {
      return;
    }

    connection.setLine(line);
    connection.initialize();
    connection.isSelected() ? connection.markAsSelected() : null;
  }

  private _calculateConnectionLine(
    connection: FConnectionBase,
    context: IFConnectionWorkerContext,
  ): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        context.sourceRect,
        context.targetRect,
        connection,
        context.source.fConnectableSide,
        context.target.fConnectableSide,
        this._resolveRotationContext(context.source),
        this._resolveRotationContext(context.target),
      ),
    );
  }

  private _resolveRotationContext(
    connector: IFConnectionWorkerContext['source'],
  ): TResolveConnectionEndpointRotationContextResponse {
    return this._mediator.execute<TResolveConnectionEndpointRotationContextResponse>(
      new ResolveConnectionEndpointRotationContextRequest(connector),
    );
  }

  private _resolveConnectionConnectors(
    connection: FConnectionBase,
  ): IFConnectionWorkerConnectors | null {
    return this._mediator.execute<IFConnectionWorkerConnectors | null>(
      new ResolveConnectionWorkerConnectorsRequest(connection),
    );
  }

  private _resolveConnectionContext(
    connection: FConnectionBase,
    cache: Map<string, IRoundedRect>,
  ): IFConnectionWorkerContext | null {
    return this._mediator.execute<IFConnectionWorkerContext | null>(
      new ResolveConnectionWorkerContextRequest(connection, cache),
    );
  }

  private _createMarkers(connection: FConnectionBase): boolean {
    return this._mediator.execute<boolean>(new CreateConnectionMarkersRequest(connection));
  }

  private _shouldRedrawConnection(connection: FConnectionBase, line: ILine): boolean {
    const pathElement = connection.fPath().hostElement;
    const signature = createConnectionRenderSignature(connection, line);
    const cached = this._connectionRenderCache.get(connection);
    if (cached?.signature === signature && cached.pathElement === pathElement) {
      return false;
    }

    this._connectionRenderCache.set(connection, { signature, pathElement });

    return true;
  }

  private _setupConnectionsUsingWorker(
    connections: readonly FConnectionBase[],
    connectorRectCache: Map<string, IRoundedRect>,
    renderTicket: number,
    nodesRevision: number,
  ): void {
    this._mediator
      .execute<Promise<readonly IFConnectionWorkerResultItem[] | null>>(
        new CalculateConnectionsUsingConnectionWorkerRequest(connections, connectorRectCache),
      )
      .then((results) => {
        if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
          return;
        }

        if (!results) {
          this._setupConnectionsChunked(
            connections,
            connectorRectCache,
            0,
            renderTicket,
            nodesRevision,
          );

          return;
        }

        const workerResults = this._alignWorkerResultsToConnectionIndexes(
          results,
          connections.length,
        );

        this._applyWorkerResultsChunked(
          connections,
          workerResults,
          connectorRectCache,
          0,
          renderTicket,
          nodesRevision,
        );
      })
      .catch(() => {
        if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
          return;
        }

        this._setupConnectionsChunked(
          connections,
          connectorRectCache,
          0,
          renderTicket,
          nodesRevision,
        );
      });
  }

  private _applyWorkerResultsChunked(
    connections: readonly FConnectionBase[],
    workerResults: readonly (IFConnectionWorkerResultItem | undefined)[],
    connectorRectCache: Map<string, IRoundedRect>,
    startIndex: number,
    renderTicket: number,
    nodesRevision: number,
  ): void {
    if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
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
      const result = workerResults[endIndex];

      if (this._isWorkerResultSupported(result)) {
        const connectors = this._resolveConnectionConnectors(connection);
        if (!connectors) {
          endIndex++;
          processed++;

          if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
            return;
          }
          continue;
        }

        try {
          connection._applyResolvedSidesToConnection(
            result.sourceSide as EFConnectableSide,
            result.targetSide as EFConnectableSide,
          );
          this._setupConnectionWithLine(
            connection,
            connectors.source,
            connectors.target,
            result.line,
          );
        } catch {
          this._setupConnection(connection, connectorRectCache);
        }
      } else {
        this._setupConnection(connection, connectorRectCache);
      }

      endIndex++;
      processed++;

      if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
        return;
      }
    }

    if (endIndex >= connections.length) {
      return;
    }

    this._requestAnimationFrame(() =>
      this._applyWorkerResultsChunked(
        connections,
        workerResults,
        connectorRectCache,
        endIndex,
        renderTicket,
        nodesRevision,
      ),
    );
  }

  private _alignWorkerResultsToConnectionIndexes(
    results: readonly IFConnectionWorkerResultItem[],
    connectionCount: number,
  ): (IFConnectionWorkerResultItem | undefined)[] {
    const aligned: (IFConnectionWorkerResultItem | undefined)[] = new Array(connectionCount);

    for (const result of results) {
      const index = result.originalIndex;
      if (typeof index !== 'number') {
        continue;
      }

      if (index < 0 || index >= connectionCount) {
        continue;
      }

      aligned[index] = result;
    }

    return aligned;
  }

  private _isWorkerResultSupported(
    result: IFConnectionWorkerResultItem | undefined,
  ): result is IFConnectionWorkerResultItem & {
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
    nodesRevision: number,
  ): void {
    if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
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

      if (!this._isCurrentRenderContext(renderTicket, nodesRevision)) {
        return;
      }
    }

    if (endIndex >= connections.length) {
      return;
    }

    this._requestAnimationFrame(() =>
      this._setupConnectionsChunked(
        connections,
        connectorRectCache,
        endIndex,
        renderTicket,
        nodesRevision,
      ),
    );
  }

  private _shouldUseWorker(connectionCount: number): boolean {
    return this._mediator.execute<boolean>(new ShouldUseConnectionWorkerRequest(connectionCount));
  }

  private _isCurrentRenderContext(renderTicket: number, nodesRevision: number): boolean {
    return renderTicket === this._renderTicket && nodesRevision === this._store.nodesRevision;
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

function createConnectionRenderSignature(connection: FConnectionBase, line: ILine): string {
  const { sourceSide, targetSide } = connection.getResolvedSides();

  return [
    connection.fBehavior,
    connection.fType,
    connection.fRadius,
    connection.fOffset,
    connection.fReassignableStart(),
    serializeContents(connection.fContents() || []),
    sourceSide,
    targetSide,
    serializePoint(line.point1),
    serializePoint(line.point2),
    serializeWaypoints(connection.fWaypoints()?.waypoints() || []),
  ].join('|');
}

function serializePoint(point: ILine['point1']): string {
  return `${point.x}:${point.y}`;
}

function serializeWaypoints(waypoints: readonly ILine['point1'][]): string {
  return waypoints.map(serializePoint).join(';');
}

function serializeContents(contents: readonly FConnectionContentBase[]): string {
  return contents
    .map((content) => {
      return [content.position(), content.offset(), content.align()].join(':');
    })
    .join(';');
}
