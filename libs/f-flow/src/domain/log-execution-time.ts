type DecoratedMethod = (...args: unknown[]) => unknown;

export function LogExecutionTime(label?: string): MethodDecorator {
  const logLabel = (propertyKey: string | symbol): string => label || String(propertyKey);

  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      return descriptor;
    }

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const startedAt = performance.now();
      const result = (originalMethod as DecoratedMethod).apply(this, args);

      if (result instanceof Promise) {
        return result.finally(() => {
          console.warn(
            `[LogExecutionTime] ${logLabel(propertyKey)} completed in ${Math.round(performance.now() - startedAt)}ms.`,
          );
        });
      }

      console.warn(
        `[LogExecutionTime] ${logLabel(propertyKey)} completed in ${Math.round(performance.now() - startedAt)}ms.`,
      );

      return result;
    } as T;

    return descriptor;
  };
}
