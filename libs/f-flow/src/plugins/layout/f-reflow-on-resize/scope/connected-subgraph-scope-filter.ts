import { IReflowCandidate, IReflowConnection } from '../selection';
import { IFReflowScopeFilter } from './i-f-reflow-scope-filter';

/**
 * Restricts the candidate pool to nodes in the same connected component
 * as the resizing source — BFS over connections in *both* directions.
 *
 * Compared to `DOWNSTREAM_CONNECTIONS` selection (one-directional), this
 * scope keeps upstream nodes too. Useful when a graph has multiple
 * disconnected sub-flows on the same canvas and a resize should affect
 * only its own component.
 */
export class ConnectedSubgraphScopeFilter implements IFReflowScopeFilter {
  public filter({
    sourceCandidate,
    candidates,
    connections,
  }: {
    sourceCandidate: IReflowCandidate | null;
    candidates: IReflowCandidate[];
    connections: IReflowConnection[];
  }): IReflowCandidate[] {
    if (!sourceCandidate) return candidates;

    const adjacency = this._buildBidirectionalAdjacency(connections);
    const reachable = this._bfs(sourceCandidate.id, adjacency);

    return candidates.filter((c) => reachable.has(c.id));
  }

  private _buildBidirectionalAdjacency(connections: IReflowConnection[]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    const add = (a: string, b: string): void => {
      const list = map.get(a);
      if (list) list.push(b);
      else map.set(a, [b]);
    };
    for (const conn of connections) {
      add(conn.outputNodeId, conn.inputNodeId);
      add(conn.inputNodeId, conn.outputNodeId);
    }

    return map;
  }

  private _bfs(start: string, adjacency: Map<string, string[]>): Set<string> {
    const visited = new Set<string>([start]);
    const queue: string[] = [start];
    while (queue.length > 0) {
      const current = queue.shift() as string;
      const next = adjacency.get(current);
      if (!next) continue;
      for (const id of next) {
        if (visited.has(id)) continue;
        visited.add(id);
        queue.push(id);
      }
    }

    return visited;
  }
}
