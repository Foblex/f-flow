export interface IHandler<TRequest, TResponse> {
  handle(request: TRequest, ...args: unknown[]): TResponse | void;
}
