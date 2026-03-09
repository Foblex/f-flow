export class ResetConnectionWorkerRuntimeRequest {
  static readonly fToken = Symbol('ResetConnectionWorkerRuntimeRequest');

  constructor(public readonly error: Error) {}
}
