export class MinimapDrawNodesRequest {
  static readonly fToken = Symbol('MinimapDrawNodesRequest');
  constructor(public readonly hostElement: SVGGElement) {}
}
