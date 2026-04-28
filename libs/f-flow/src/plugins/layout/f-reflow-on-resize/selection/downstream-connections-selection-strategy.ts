import {
  IFReflowSelectionStrategy,
  IReflowCandidate,
  IReflowConnection,
} from './i-f-reflow-selection-strategy';
import { FReflowCycleGuard } from './f-reflow-cycle-guard';

/**
 * Restricts the candidate pool to nodes reachable from the source via
 * outgoing connections (BFS).
 *
 * - Walks `outputNodeId === sourceId → inputNodeId` repeatedly.
 * - Cycles (legitimate or adversarial) terminate via `FReflowCycleGuard`.
 * - The geometric "is this candidate actually below / right of the
 *   source" decision still happens later in the delta calculator —
 *   this strategy only narrows the pool to graph-downstream nodes.
 *
 * Practical use: workflow editors where the user expects a resize to
 * cascade only along the data flow, not to unrelated branches.
 */
export class DownstreamConnectionsSelectionStrategy implements IFReflowSelectionStrategy {
  constructor(private readonly _maxCascadeDepth: number) {}

  public select({
    sourceId,
    candidates,
    connections,
  }: {
    sourceId: string;
    candidates: IReflowCandidate[];
    connections: IReflowConnection[];
  }): IReflowCandidate[] {
    const downstream = new Set<string>();
    const guard = new FReflowCycleGuard(this._maxCascadeDepth);
    const queue: string[] = [sourceId];

    // Adjacency list keyed by upstream node — built once, reused per BFS
    // step to keep the traversal at O(connections + nodes) per plan.
    const adjacency = this._buildAdjacency(connections);

    while (queue.length > 0) {
      const current = queue.shift() as string;
      if (!guard.visit(current)) continue;

      const next = adjacency.get(current);
      if (!next) continue;
      for (const nextId of next) {
        if (downstream.has(nextId) || nextId === sourceId) continue;
        downstream.add(nextId);
        queue.push(nextId);
      }
    }

    return candidates.filter((c) => c.id !== sourceId && downstream.has(c.id));
  }

  private _buildAdjacency(connections: IReflowConnection[]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const conn of connections) {
      const list = map.get(conn.outputNodeId);
      if (list) list.push(conn.inputNodeId);
      else map.set(conn.outputNodeId, [conn.inputNodeId]);
    }

    return map;
  }
}
