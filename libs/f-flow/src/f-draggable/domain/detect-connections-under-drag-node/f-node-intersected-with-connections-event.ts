/**
 * @deprecated Use `FNodeConnectionsIntersectionEvent`.
 * Will be removed in a future major release.
 */
export class FNodeIntersectedWithConnections {
  constructor(
    /** @deprecated Use `nodeId` */
    public readonly fNodeId: string,
    /** @deprecated Use `connectionIds` */
    public readonly fConnectionIds: string[],
  ) {}
}

/**
 * @public API
 * Emitted when a dragged node intersects connections
 * that are not attached to this node.
 */
export class FNodeConnectionsIntersectionEvent extends FNodeIntersectedWithConnections {
  public constructor(
    public readonly nodeId: string,
    public readonly connectionIds: string[],
  ) {
    // keep backward compat fields on the same instance
    super(nodeId, connectionIds);
  }
}
