export class EnsureNodeGeometryFreshRequest {
  static readonly fToken = Symbol('EnsureNodeGeometryFreshRequest');

  constructor(public readonly nodeId: string) {}
}
