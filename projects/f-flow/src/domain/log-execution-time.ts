export function LogExecutionTime(label?: string): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> | void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.time(label || String(propertyKey));
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.finally(() => console.timeEnd(label || String(propertyKey)));
      }

      console.timeEnd(label || String(propertyKey));

      return result;
    };

    return descriptor;
  };
}
