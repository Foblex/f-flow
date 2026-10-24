export class InvalidateFCacheNodeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('InvalidateFCacheNodeRequest');

  constructor(
    public readonly nodeId: string,
    public readonly reason: string = 'manual',
  ) {}
}
