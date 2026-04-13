export class InvalidateFCacheNodeRequest {
  static readonly fToken = Symbol('InvalidateFCacheNodeRequest');

  constructor(
    public readonly nodeId: string,
    public readonly reason: string = 'manual',
  ) {}
}
