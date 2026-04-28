/**
 * Bounded visited-set guard for graph traversals.
 *
 * BFS / DFS over the connection graph must terminate even when the user
 * has authored cycles (which f-flow allows). The guard rejects already-
 * visited node ids and trips a depth fuse when traversal exceeds the
 * configured ceiling — defending against adversarial graph shapes
 * without imposing a static depth limit on legitimate ones.
 */
export class FReflowCycleGuard {
  private readonly _visited = new Set<string>();

  constructor(private readonly _maxDepth: number) {}

  public visit(id: string): boolean {
    if (this._visited.has(id)) return false;
    if (this._visited.size >= this._maxDepth) return false;
    this._visited.add(id);

    return true;
  }

  public has(id: string): boolean {
    return this._visited.has(id);
  }

  public size(): number {
    return this._visited.size;
  }
}
