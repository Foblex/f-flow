export class UnregisterFCacheNodeRequest {
  static readonly fToken = Symbol('UnregisterFCacheNodeRequest');

  constructor(public readonly id: string) {}
}
