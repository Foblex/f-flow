type DecoratedMethod = (...args: unknown[]) => unknown;

export function Deprecated(newMethodName: string, removalVersion: string = '18.0.0'): MethodDecorator {
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
      console.warn(
        `Method "${String(propertyKey)}" is deprecated. Use "${newMethodName}" instead. This method will be removed in version ${removalVersion}.`,
      );

      return (originalMethod as DecoratedMethod).apply(this, args);
    } as T;

    return descriptor;
  };
}
