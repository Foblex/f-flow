export class DisableConnectionWorkerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DisableConnectionWorkerRequest');

  constructor(public error: Error) {}
}
