export class ResetConnectionWorkerRuntimeRequest {
  static readonly fToken = Symbol('ResetConnectionWorkerRuntimeRequest');

  constructor(public error: Error) {}
}
