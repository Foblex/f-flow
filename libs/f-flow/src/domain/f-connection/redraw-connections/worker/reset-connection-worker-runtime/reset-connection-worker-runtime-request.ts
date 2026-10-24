export class ResetConnectionWorkerRuntimeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ResetConnectionWorkerRuntimeRequest');

  constructor(public error: Error) {}
}
