import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { CompleteConnectionRedrawRequest } from './pipeline/complete-connection-redraw';
import { RunConnectionRedrawSliceRequest } from './pipeline/run-connection-redraw-slice';
import { StartConnectionRedrawRequest } from './pipeline/start-connection-redraw';
import { ConnectionRedrawState, IConnectionRedrawSession } from './models';
import { ShouldUseConnectionWorkerRequest } from './worker/should-use-connection-worker';
import { StartConnectionWorkerRedrawRequest } from './worker/start-connection-worker-redraw';
import { FConnectionBase } from '../../../f-connection-v2';
import { findSourceConnector, findTargetConnector } from '../../../f-connectors';

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
  private readonly _state = inject(ConnectionRedrawState);

  public handle(_: RedrawConnectionsRequest): void {
    const scope = this._resolveScope();
    const session = this._mediator.execute<IConnectionRedrawSession>(
      new StartConnectionRedrawRequest(scope === null),
    );

    this._createMarkersForCreate();

    this._createMarkersForSnap();

    const connections =
      scope === null ? [...this._store.connections.getAll()] : this._connectionsTouching(scope);
    const connectorRectCache = new Map<string, IRoundedRect>();

    if (!connections.length) {
      this._mediator.execute<void>(new CompleteConnectionRedrawRequest(session));

      return;
    }

    if (this._shouldUseConnectionWorker(connections.length)) {
      this._redrawUsingWorker(connections, connectorRectCache, session);
    } else {
      this._redrawWithoutWorker(connections, connectorRectCache, session);
    }
  }

  /**
   * A pass narrowed to the nodes whose geometry actually changed (single-node
   * resizes/state changes); `null` = redraw everything. Escalates to a full
   * pass while a previous pass is still in flight, because starting a new
   * session aborts the running one mid-slice.
   */
  private _resolveScope(): ReadonlySet<string> | null {
    const scope = this._store.takeConnectionsDirtyScope();
    if (scope === null || !this._state.isPassCompleted) {
      return null;
    }

    return scope;
  }

  private _connectionsTouching(nodeIds: ReadonlySet<string>): FConnectionBase[] {
    if (!nodeIds.size) {
      return [];
    }

    return this._store.connections.getAll().filter((connection) => {
      const source = findSourceConnector(this._store, connection.sourceId());
      const target = findTargetConnector(this._store, connection.targetId());
      // Unresolved endpoints keep full-pass behavior for this connection.
      if (!source || !target) {
        return true;
      }

      return nodeIds.has(source.fNodeId) || nodeIds.has(target.fNodeId);
    });
  }

  private _createMarkersForCreate(): void {
    const instance = this._store.connections.getForCreate();
    if (instance) {
      this._mediator.execute<boolean>(new CreateConnectionMarkersRequest(instance));
    }
  }

  private _createMarkersForSnap(): void {
    const instance = this._store.connections.getForSnap();
    if (instance) {
      this._mediator.execute<boolean>(new CreateConnectionMarkersRequest(instance));
    }
  }

  private _shouldUseConnectionWorker(connectionLength: number) {
    return this._mediator.execute<boolean>(new ShouldUseConnectionWorkerRequest(connectionLength));
  }

  private _redrawUsingWorker(
    connections: FConnectionBase[],
    cache: Map<string, IRoundedRect>,
    session: IConnectionRedrawSession,
  ): void {
    this._mediator.execute<void>(
      new StartConnectionWorkerRedrawRequest(connections, cache, session),
    );
  }

  private _redrawWithoutWorker(
    connections: FConnectionBase[],
    cache: Map<string, IRoundedRect>,
    session: IConnectionRedrawSession,
  ): void {
    this._mediator.execute<void>(
      new RunConnectionRedrawSliceRequest(connections, cache, 0, session),
    );
  }
}
