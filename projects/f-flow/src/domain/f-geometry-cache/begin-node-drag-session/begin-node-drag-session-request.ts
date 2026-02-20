export class BeginNodeDragSessionRequest {
  static readonly fToken = Symbol('BeginNodeDragSessionRequest');

  constructor(public readonly nodeId: string) {}
}
