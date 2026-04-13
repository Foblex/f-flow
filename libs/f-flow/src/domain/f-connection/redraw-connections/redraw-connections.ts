import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateConnectionMarkersRequest } from '../create-connection-markers';
import { CompleteConnectionRedrawRequest } from './pipeline/complete-connection-redraw';
import { RunConnectionRedrawSliceRequest } from './pipeline/run-connection-redraw-slice';
import { StartConnectionRedrawRequest } from './pipeline/start-connection-redraw';
import { IConnectionRedrawSession } from './models';
import { ShouldUseConnectionWorkerRequest } from './worker/should-use-connection-worker';
import { StartConnectionWorkerRedrawRequest } from './worker/start-connection-worker-redraw';
import { FConnectionBase } from '../../../f-connection-v2';

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

  public handle(_: RedrawConnectionsRequest): void {
    const session = this._mediator.execute<IConnectionRedrawSession>(
      new StartConnectionRedrawRequest(),
    );

    this._createMarkersForCreate();

    this._createMarkersForSnap();

    const connections = [...this._store.connections.getAll()];
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
