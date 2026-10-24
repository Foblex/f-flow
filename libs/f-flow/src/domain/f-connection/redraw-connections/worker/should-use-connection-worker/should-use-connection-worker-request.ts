export class ShouldUseConnectionWorkerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: boolean;

  static readonly fToken = Symbol('ShouldUseConnectionWorkerRequest');

  constructor(public connectionCount: number) {}
}
