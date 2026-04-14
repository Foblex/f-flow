export class ShouldUseConnectionWorkerRequest {
  static readonly fToken = Symbol('ShouldUseConnectionWorkerRequest');

  constructor(public connectionCount: number) {}
}
