import { FMediator } from '@foblex/mediator';
import { configureDiTest, FConnectionBase, injectFromDi, valueProvider } from '@foblex/flow';
import { FComponentsStore } from '../../../f-storage';
import { IConnectionRedrawSession } from './models';
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
  let connections: FConnectionBase[];

  const session: IConnectionRedrawSession = {
    renderTicket: 1,
    connectionsRevision: 2,
    nodesRevision: 3,
  };

  beforeEach(() => {
    mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    connections = [];
    store = {
      connections: {
        getForCreate: () => undefined,
        getForSnap: () => undefined,
        getAll: () => connections,
      },
    } as unknown as FComponentsStore;

    configureDiTest({
      providers: [
        RedrawConnections,
        valueProvider(FMediator, mediator),
        valueProvider(FComponentsStore, store),
      ],
    });

    execution = injectFromDi(RedrawConnections);
  });

  it('completes redraw immediately when there are no connections', () => {
    mediator.execute.and.callFake(<TResponse>(request: object): TResponse => {
      if (request instanceof StartConnectionRedrawRequest) {
        return session as TResponse;
      }

      return undefined as TResponse;
    });

    execution.handle(new RedrawConnectionsRequest());

    expect(
      _getRequests().some((request) => request instanceof CompleteConnectionRedrawRequest),
    ).toBeTrue();
  });

  it('starts chunked redraw when worker path is not used', () => {
    connections = [{} as FConnectionBase];
    mediator.execute.and.callFake(<TResponse>(request: object): TResponse => {
      if (request instanceof StartConnectionRedrawRequest) {
        return session as TResponse;
      }

      if (request instanceof ShouldUseConnectionWorkerRequest) {
        return false as TResponse;
      }

      return undefined as TResponse;
    });

    execution.handle(new RedrawConnectionsRequest());

    expect(
      _getRequests().some((request) => request instanceof RunConnectionRedrawSliceRequest),
    ).toBeTrue();
    expect(
      _getRequests().some((request) => request instanceof StartConnectionWorkerRedrawRequest),
    ).toBeFalse();
  });

  it('starts worker redraw when worker path is enabled', () => {
    connections = [{} as FConnectionBase];
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

  function _getRequests(): object[] {
    return mediator.execute.calls.allArgs().map(([request]) => request);
  }
});
