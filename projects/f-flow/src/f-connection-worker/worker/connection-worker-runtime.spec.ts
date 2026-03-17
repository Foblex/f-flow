import {
  createConnectionWorkerUrl,
  isConnectionWorkerRuntimeSupported,
  resolveConnectionWorkerRuntime,
  revokeConnectionWorkerUrl,
} from './connection-worker-runtime';

type TTestConnectionWorkerWindow = Window & typeof globalThis;

function createTestWindow(
  createObjectURL: () => string,
  revokeObjectURL: () => void,
): TTestConnectionWorkerWindow {
  const windowRef = {} as TTestConnectionWorkerWindow;
  const mutableWindowRef = windowRef as unknown as Record<string, unknown>;

  mutableWindowRef['Blob'] = Blob;
  mutableWindowRef['Worker'] = class MockWorker {};
  mutableWindowRef['URL'] = {
    createObjectURL,
    revokeObjectURL,
  } satisfies Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;

  return windowRef;
}

describe('connection-worker-runtime', () => {
  it('recognizes blob worker runtime support', () => {
    const windowRef = createTestWindow(
      () => 'blob:worker',
      () => void 0,
    );

    expect(isConnectionWorkerRuntimeSupported(windowRef)).toBeTrue();
    expect(isConnectionWorkerRuntimeSupported(null)).toBeFalse();
  });

  it('creates a javascript blob url for the worker source', async () => {
    const createObjectURL = jasmine.createSpy('createObjectURL').and.returnValue('blob:worker');
    const windowRef = createTestWindow(createObjectURL, () => void 0);
    const runtime = resolveConnectionWorkerRuntime(windowRef);
    if (!runtime) {
      fail('Expected connection worker runtime to be supported.');

      return;
    }

    expect(createConnectionWorkerUrl(runtime)).toBe('blob:worker');
    expect(createObjectURL).toHaveBeenCalledTimes(1);

    const blob = createObjectURL.calls.mostRecent().args[0] as Blob;
    expect(blob.type).toBe('text/javascript');
    await expectAsync(blob.text()).toBeResolvedTo(
      jasmine.stringContaining("addEventListener('message'"),
    );
  });

  it('revokes blob urls when provided', () => {
    const revokeObjectURL = jasmine.createSpy('revokeObjectURL');

    revokeConnectionWorkerUrl('blob:worker', { revokeObjectURL });

    expect(revokeObjectURL).toHaveBeenCalledOnceWith('blob:worker');
  });
});
