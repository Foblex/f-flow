import { FMediator } from '@foblex/mediator';
import {
  configureDiTest,
  createSpy,
  EFConnectableSide,
  FConnectionBase,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { RenderConnectionFromGeometryRequest } from '../../main-thread/render-connection-from-geometry';
import { RenderConnectionWithLineRequest } from '../../main-thread/render-connection-with-line';
import { IConnectionWorkerBatchItem } from '../../models';
import { ResolveConnectionEndpointsRequest } from '../../shared/resolve-connection-endpoints';
import { ApplyConnectionWorkerResult } from './apply-connection-worker-result';
import { ApplyConnectionWorkerResultRequest } from './apply-connection-worker-result-request';

describe('ApplyConnectionWorkerResult', () => {
  let execution: ApplyConnectionWorkerResult;
  let mediator: jasmine.SpyObj<FMediator>;
  let connection: FConnectionBase & {
    _applyResolvedSidesToConnection: jasmine.Spy;
  };
  let batchItem: IConnectionWorkerBatchItem;

  beforeEach(() => {
    mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    connection = {
      _applyResolvedSidesToConnection: createSpy('_applyResolvedSidesToConnection'),
    } as unknown as FConnectionBase & {
      _applyResolvedSidesToConnection: jasmine.Spy;
    };
    batchItem = {
      connection,
      geometry: {
        source: {} as never,
        target: {} as never,
        sourceRect: {} as never,
        targetRect: {} as never,
      },
      payload: {} as never,
    };

    configureDiTest({
      providers: [ApplyConnectionWorkerResult, valueProvider(FMediator, mediator)],
    });

    execution = injectFromDi(ApplyConnectionWorkerResult);
  });

  it('applies prepared worker geometry without resolving endpoints again', () => {
    execution.handle(
      new ApplyConnectionWorkerResultRequest(batchItem, {
        originalIndex: 0,
        supported: true,
        sourceSide: 'right',
        targetSide: 'left',
        line: {
          point1: { x: 10, y: 20 },
          point2: { x: 30, y: 40 },
        },
      }),
    );

    expect(connection._applyResolvedSidesToConnection).toHaveBeenCalledOnceWith(
      EFConnectableSide.RIGHT,
      EFConnectableSide.LEFT,
    );
    expect(
      _getRequests().some((request) => request instanceof RenderConnectionWithLineRequest),
    ).toBeTrue();
    expect(
      _getRequests().some((request) => request instanceof RenderConnectionFromGeometryRequest),
    ).toBeFalse();
    expect(
      _getRequests().some((request) => request instanceof ResolveConnectionEndpointsRequest),
    ).toBeFalse();
  });

  it('falls back to prepared main-thread geometry when worker result is unsupported', () => {
    execution.handle(
      new ApplyConnectionWorkerResultRequest(batchItem, {
        originalIndex: 0,
        supported: false,
      }),
    );

    expect(connection._applyResolvedSidesToConnection).not.toHaveBeenCalled();
    expect(
      _getRequests().some((request) => request instanceof RenderConnectionFromGeometryRequest),
    ).toBeTrue();
    expect(
      _getRequests().some((request) => request instanceof RenderConnectionWithLineRequest),
    ).toBeFalse();
    expect(
      _getRequests().some((request) => request instanceof ResolveConnectionEndpointsRequest),
    ).toBeFalse();
  });

  function _getRequests(): object[] {
    return mediator.execute.calls.allArgs().map(([request]) => request);
  }
});
