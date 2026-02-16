export type SpyFunction<TArgs extends unknown[] = unknown[], TResult = unknown> = ((
  ...args: TArgs
) => TResult) & {
  calls?: {
    count(): number;
  };
  and?: {
    returnValue(value: TResult): unknown;
    callFake(fn: (...args: TArgs) => TResult): unknown;
  };
};

interface JasmineRuntime {
  createSpy(name: string): SpyFunction;
  createSpyObj(baseName: string, methodNames: readonly string[]): Record<string, SpyFunction>;
}

function getJasmineRuntime(): JasmineRuntime {
  const runtime = (globalThis as { jasmine?: JasmineRuntime }).jasmine;

  if (!runtime) {
    throw new Error('Jasmine runtime is not available.');
  }

  return runtime;
}

export function createSpy<TArgs extends unknown[] = unknown[], TResult = unknown>(
  name: string,
): SpyFunction<TArgs, TResult> {
  return getJasmineRuntime().createSpy(name) as SpyFunction<TArgs, TResult>;
}

export function createSpyObj<TMethods extends string>(
  baseName: string,
  methodNames: readonly TMethods[],
): Record<TMethods, SpyFunction> {
  return getJasmineRuntime().createSpyObj(baseName, methodNames) as Record<TMethods, SpyFunction>;
}
