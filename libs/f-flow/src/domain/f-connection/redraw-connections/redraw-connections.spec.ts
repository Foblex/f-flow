import { FMediator } from '@foblex/mediator';
import {
  configureDiTest,
  connectorFactory,
  FConnectionBase,
  injectFromDi,
  nodeFactory,
  registryAdd,
  valueProvider,
} from '@foblex/flow';
import { FComponentsStore } from '../../../f-storage';
import { FConnectorBase } from '../../../f-connectors';
import { ConnectionRedrawState, IConnectionRedrawSession } from './models';
import { CompleteConnectionRedrawRequest } from './pipeline/complete-connection-redraw';
import { RunConnectionRedrawSliceRequest } from './pipeline/run-connection-redraw-slice';
import { StartConnectionRedrawRequest } from './pipeline/start-connection-redraw';
import { RedrawConnectionsRequest } from './redraw-connections-request';
import { RedrawConnections } from './redraw-connections';
import { ShouldUseConnectionWorkerRequest } from './worker/should-use-connection-worker';
import { StartConnectionWorkerRedrawRequest } from './worker/start-connection-worker-redraw';

describe('RedrawConnections', () => {
  let execution: RedrawConnections;
  let mediator: jasmine.SpyObj<FMediator>;
  let store: FComponentsStore;
  let state: ConnectionRedrawState;
  let connections: FConnectionBase[];

  const session: IConnectionRedrawSession = {
    renderTicket: 1,
    connectionsRevision: 2,
    nodesRevision: 3,
  };

  function addConnection(id: string, sourceId: string, targetId: string): FConnectionBase {
    const connection = {
      fId: () => id,
      sourceId: () => sourceId,
      targetId: () => targetId,
    } as unknown as FConnectionBase;
    registryAdd(store.connections, connection);
    connections.push(connection);

    return connection;
  }

  beforeEach(() => {
    mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    connections = [];
    store = new FComponentsStore();
    state = new ConnectionRedrawState();

    configureDiTest({
      providers: [
        RedrawConnections,
        valueProvider(FMediator, mediator),
        valueProvider(FComponentsStore, store),
        valueProvider(ConnectionRedrawState, state),
      ],
    });

    execution = injectFromDi(RedrawConnections);

    mediator.execute.and.callFake(<TResponse>(request: object): TResponse => {
      if (request instanceof StartConnectionRedrawRequest) {
        state.beginRender();

        return session as TResponse;
      }

      if (request instanceof CompleteConnectionRedrawRequest) {
        state.isPassCompleted = true;
      }

      return undefined as TResponse;
    });
  });

  it('completes redraw immediately when there are no connections', () => {
    execution.handle(new RedrawConnectionsRequest());

    expect(
      _getRequests().some((request) => request instanceof CompleteConnectionRedrawRequest),
    ).toBeTrue();
  });

  it('starts chunked redraw when worker path is not used', () => {
    addConnection('c1', 'out', 'in');

    execution.handle(new RedrawConnectionsRequest());

    expect(
      _getRequests().some((request) => request instanceof RunConnectionRedrawSliceRequest),
    ).toBeTrue();
    expect(
      _getRequests().some((request) => request instanceof StartConnectionWorkerRedrawRequest),
    ).toBeFalse();
  });

  it('starts worker redraw when worker path is enabled', () => {
    addConnection('c1', 'out', 'in');
    mediator.execute.and.callFake(<TResponse>(request: object): TResponse => {
      if (request instanceof StartConnectionRedrawRequest) {
        return session as TResponse;
      }

      if (request instanceof ShouldUseConnectionWorkerRequest) {
        return true as TResponse;
      }

      return undefined as TResponse;
    });

    execution.handle(new RedrawConnectionsRequest());

    expect(
      _getRequests().some((request) => request instanceof StartConnectionWorkerRedrawRequest),
    ).toBeTrue();
    expect(
      _getRequests().some((request) => request instanceof RunConnectionRedrawSliceRequest),
    ).toBeFalse();
  });

  describe('scoped passes', () => {
    beforeEach(() => {
      registryAdd<FConnectorBase>(
        store.connectors,
        connectorFactory().id('a-out').connectorType('source').nodeId('node-a').build(),
      );
      registryAdd<FConnectorBase>(
        store.connectors,
        connectorFactory().id('b-in').connectorType('target').nodeId('node-b').build(),
      );
      registryAdd<FConnectorBase>(
        store.connectors,
        connectorFactory().id('c-out').connectorType('source').nodeId('node-c').build(),
      );
      registryAdd<FConnectorBase>(
        store.connectors,
        connectorFactory().id('d-in').connectorType('target').nodeId('node-d').build(),
      );

      addConnection('ab', 'a-out', 'b-in');
      addConnection('cd', 'c-out', 'd-in');
      // The first pass is always full; settle it so scopes are honored.
      execution.handle(new RedrawConnectionsRequest());
      state.isPassCompleted = true;
      mediator.execute.calls.reset();
    });

    it('redraws only the connections touching the dirty node', () => {
      store.emitConnectionChanges('node-a');

      execution.handle(new RedrawConnectionsRequest());

      const slice = _getRequests().find(
        (request): request is RunConnectionRedrawSliceRequest =>
          request instanceof RunConnectionRedrawSliceRequest,
      );
      expect(slice?.connections.map((x) => x.fId())).toEqual(['ab']);
    });

    it('redraws connections owned by descendants of a dirty group', () => {
      registryAdd(store.nodes, nodeFactory().id('group').build());
      registryAdd(store.nodes, nodeFactory().id('nested-group').parent('group').build());
      registryAdd(store.nodes, nodeFactory().id('node-a').parent('nested-group').build());
      registryAdd(store.nodes, nodeFactory().id('node-b').build());

      store.emitConnectionChanges('group');

      execution.handle(new RedrawConnectionsRequest());

      const slice = _getRequests().find(
        (request): request is RunConnectionRedrawSliceRequest =>
          request instanceof RunConnectionRedrawSliceRequest,
      );
      expect(slice?.connections.map((x) => x.fId())).toEqual(['ab']);
    });

    it('does not reset the connected state on a scoped pass', () => {
      store.emitConnectionChanges('node-a');

      execution.handle(new RedrawConnectionsRequest());

      const start = _getRequests().find(
        (request): request is StartConnectionRedrawRequest =>
          request instanceof StartConnectionRedrawRequest,
      );
      expect(start?.resetConnectedState).toBeFalse();
    });

    it('escalates to a full pass when any emission was global', () => {
      store.emitConnectionChanges('node-a');
      store.emitConnectionChanges();

      execution.handle(new RedrawConnectionsRequest());

      const slice = _getRequests().find(
        (request): request is RunConnectionRedrawSliceRequest =>
          request instanceof RunConnectionRedrawSliceRequest,
      );
      expect(slice?.connections.length).toBe(2);
    });

    it('escalates to a full pass while the previous pass is still running', () => {
      state.isPassCompleted = false;
      store.emitConnectionChanges('node-a');

      execution.handle(new RedrawConnectionsRequest());

      const slice = _getRequests().find(
        (request): request is RunConnectionRedrawSliceRequest =>
          request instanceof RunConnectionRedrawSliceRequest,
      );
      expect(slice?.connections.length).toBe(2);
    });
  });

  function _getRequests(): object[] {
    return mediator.execute.calls.allArgs().map(([request]) => request);
  }
});
