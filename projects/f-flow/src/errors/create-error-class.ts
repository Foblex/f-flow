export function createErrorClass<T>(impl: (_super: any) => any): T {
  const _super = (instance: any) => {
    Error.call(instance);
  };

  const constructor = impl(_super);
  constructor.prototype = Object.create(Error.prototype);
  constructor.prototype.constructor = constructor;
  return constructor;
}
