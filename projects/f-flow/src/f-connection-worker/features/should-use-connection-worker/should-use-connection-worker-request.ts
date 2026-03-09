export class ShouldUseConnectionWorkerRequest {
  static readonly fToken = Symbol('ShouldUseFConnectionWorkerRequest');

  constructor(public readonly connectionCount: number) {}
}
