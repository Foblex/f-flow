export class EmitConnectionsChangesRequest {
  static readonly fToken = Symbol('EmitConnectionsChangesRequest');
  /**
   * When set, only connections touching this node need a redraw; omitted
   * means "redraw everything" — the safe default every caller keeps unless
   * it knows the change is local to one node.
   */
  constructor(public readonly dirtyNodeId?: string) {}
}
