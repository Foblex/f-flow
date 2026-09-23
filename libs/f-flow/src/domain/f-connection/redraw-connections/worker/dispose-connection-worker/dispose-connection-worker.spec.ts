import { configureDiTest, injectFromDi } from '@foblex/flow';
import { ConnectionWorkerState } from '../../models';
import { DisposeConnectionWorker } from './dispose-connection-worker';
import { DisposeConnectionWorkerRequest } from './dispose-connection-worker-request';

describe('DisposeConnectionWorker', () => {
  let execution: DisposeConnectionWorker;
  let state: ConnectionWorkerState;
  let terminate: jasmine.Spy;
  let revokeObjectURL: jasmine.Spy;

  beforeEach(() => {
    configureDiTest({
      providers: [ConnectionWorkerState, DisposeConnectionWorker],
    });

    execution = injectFromDi(DisposeConnectionWorker);
    state = injectFromDi(ConnectionWorkerState);

    terminate = jasmine.createSpy('terminate');
    revokeObjectURL = spyOn(URL, 'revokeObjectURL');
  });

  it('terminates the worker and revokes its blob url', () => {
    state.worker = { terminate } as unknown as Worker;
    state.workerUrl = 'blob:f-flow-connection-worker';

    execution.handle(new DisposeConnectionWorkerRequest());

    expect(terminate).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledOnceWith('blob:f-flow-connection-worker');
    expect(state.worker).toBeNull();
    expect(state.workerUrl).toBeNull();
  });

  it('rejects requests still in flight instead of leaving them pending', async () => {
    state.worker = { terminate } as unknown as Worker;
    const inFlight = new Promise<unknown>((resolve, reject) => {
      state.pending.set(1, { resolve, reject });
    });

    execution.handle(new DisposeConnectionWorkerRequest());

    await expectAsync(inFlight).toBeRejected();
    expect(state.pending.size).toBe(0);
    expect(terminate).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the lazy worker was never created', () => {
    execution.handle(new DisposeConnectionWorkerRequest());

    expect(terminate).not.toHaveBeenCalled();
    expect(revokeObjectURL).not.toHaveBeenCalled();
    expect(state.worker).toBeNull();
    expect(state.workerUrl).toBeNull();
  });
});
