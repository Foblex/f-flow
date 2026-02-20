import { IRect } from '@foblex/2d';

/**
 * A simple uniform-grid spatial index for fast visible-node queries
 * without any third-party dependencies.
 *
 * Bucket size should approximate the average node width/height.
 * Nodes that span multiple buckets are inserted into all overlapping cells.
 */
export class FUniformGridSpatialIndex {
  private readonly _cells = new Map<string, Set<string>>();
  private readonly _nodeCells = new Map<string, string[]>();

  constructor(private readonly bucketSize: number = 200) {}

  /** Insert or update a node's world-rect in the index. */
  public upsert(nodeId: string, worldRect: IRect): void {
    this._remove(nodeId);

    const cells = this._cellsForRect(worldRect);
    this._nodeCells.set(nodeId, cells);

    for (const key of cells) {
      if (!this._cells.has(key)) {
        this._cells.set(key, new Set<string>());
      }
      this._cells.get(key)!.add(nodeId);
    }
  }

  /** Remove a node from the index. */
  public remove(nodeId: string): void {
    this._remove(nodeId);
  }

  /** Query all node IDs whose rects potentially intersect the given world rect. */
  public query(visibleRect: IRect): string[] {
    const result = new Set<string>();
    const cells = this._cellsForRect(visibleRect);

    for (const key of cells) {
      const bucket = this._cells.get(key);
      if (bucket) {
        bucket.forEach((id) => result.add(id));
      }
    }

    return Array.from(result);
  }

  /** Remove all entries from the index. */
  public clear(): void {
    this._cells.clear();
    this._nodeCells.clear();
  }

  /** Returns the number of nodes tracked in the index. */
  public size(): number {
    return this._nodeCells.size;
  }

  private _remove(nodeId: string): void {
    const old = this._nodeCells.get(nodeId);
    if (!old) {
      return;
    }
    for (const key of old) {
      const bucket = this._cells.get(key);
      if (bucket) {
        bucket.delete(nodeId);
        if (bucket.size === 0) {
          this._cells.delete(key);
        }
      }
    }
    this._nodeCells.delete(nodeId);
  }

  private _cellsForRect(rect: IRect): string[] {
    const minCx = Math.floor(rect.x / this.bucketSize);
    const minCy = Math.floor(rect.y / this.bucketSize);
    const maxCx = Math.floor((rect.x + rect.width) / this.bucketSize);
    const maxCy = Math.floor((rect.y + rect.height) / this.bucketSize);

    const result: string[] = [];
    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        result.push(`${cx},${cy}`);
      }
    }
    return result;
  }
}
