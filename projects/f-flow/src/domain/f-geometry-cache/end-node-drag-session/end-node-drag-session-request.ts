export class EndNodeDragSessionRequest {
  static readonly fToken = Symbol('EndNodeDragSessionRequest');

  /**
   * @param nodeId - the node whose drag session ends
   * @param commit - when `true` the final delta is committed to the cache (no stale mark);
   *                 when `false` the cache entries are marked stale for a fresh re-read.
   */
  constructor(
    public readonly nodeId: string,
    public readonly commit: boolean = true,
  ) {}
}
