export function Deprecated(newMethodName: string, removalVersion: string = '18.0.0'): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> | void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.warn(
        `Method "${String(propertyKey)}" is deprecated. Use "${newMethodName}" instead. This method will be removed in version ${removalVersion}.`,
      );

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

