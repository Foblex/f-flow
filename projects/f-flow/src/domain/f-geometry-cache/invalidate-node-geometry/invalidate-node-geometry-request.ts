export class InvalidateNodeGeometryRequest {
  static readonly fToken = Symbol('InvalidateNodeGeometryRequest');

  constructor(public readonly nodeId: string) {}
}
