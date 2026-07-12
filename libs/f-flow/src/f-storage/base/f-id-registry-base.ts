import { Signal } from '@angular/core';

export interface FHasId {
  fId: Signal<string>;
}

/**
 * Stores instances indexed by `fId()` + preserves insertion order.
 *
 * - `get(id)` returns `undefined`
 * - `require(id)` throws with a readable message that includes `kind`
 */
export abstract class FIdRegistryBase<TInstance extends FHasId> {
  private readonly _items: TInstance[] = [];
  private readonly _byId = new Map<string, TInstance>();

  /**
   * Removals are collected here and compacted out of `_items` in one pass on
   * the next ordered read. A large teardown is O(n) total instead of the
   * O(n^2) that per-removal indexOf+splice cost; `_byId` reflects removals
   * immediately, so id lookups never see removed instances.
   */
  private readonly _pendingRemovals = new Set<TInstance>();
  private _isCompactionScheduled = false;

  /** Used only for error messages. Example: "node", "connection", "input". */
  protected abstract readonly kind: string;

  public get(id: string): TInstance | undefined {
    return this._byId.get(id);
  }

  public require(id: string): TInstance {
    const found = this._byId.get(id);
    if (!found) {
      throw new Error(`${this.kind} not found: ${id}`);
    }

    return found;
  }

  public has(id: string): boolean {
    return this._byId.has(id);
  }

  public getAll(): TInstance[] {
    this._compact();

    return this._items;
  }

  public size(): number {
    return this._byId.size;
  }

  /**
   * Adds an instance.
   * If instance with the same id already exists — throws (keeps data consistent).
   */
  public add(instance: TInstance): void {
    const id = instance.fId();

    if (this._byId.has(id)) {
      throw new Error(`${this.kind} already exists: ${id}`);
    }

    // Re-adding an instance whose removal is still pending would leave two
    // copies in the ordered list; settle the pending removal first.
    if (this._pendingRemovals.has(instance)) {
      this._compact();
    }

    this._items.push(instance);
    this._byId.set(id, instance);
  }

  public addMany(instances: readonly TInstance[]): void {
    for (const instance of instances) {
      this.add(instance);
    }
  }

  /**
   * Removes by instance reference (fast path).
   * Returns `true` if removed, `false` if not found.
   */
  public remove(instance: TInstance): boolean {
    const id = instance.fId();
    const existing = this._byId.get(id);

    if (!existing) {
      return false;
    }

    // Defensive: if another instance with same id is in registry (shouldn't happen),
    // we remove by id anyway.
    this._byId.delete(id);
    this._pendingRemovals.add(existing);
    this._scheduleCompaction();

    return true;
  }

  /**
   * Removes by id.
   * Returns removed instance (if existed).
   */
  public removeById(id: string): TInstance | undefined {
    const existing = this._byId.get(id);
    if (!existing) {
      return undefined;
    }

    this._byId.delete(id);
    this._pendingRemovals.add(existing);
    this._scheduleCompaction();

    return existing;
  }

  /**
   * Clears registry (does NOT touch other state outside).
   */
  public clear(): void {
    this._items.length = 0;
    this._byId.clear();
    this._pendingRemovals.clear();
  }

  /** Compacts in place so `getAll()` keeps one array identity across reads. */
  private _compact(): void {
    if (!this._pendingRemovals.size) {
      return;
    }

    let writeIndex = 0;
    for (const item of this._items) {
      if (!this._pendingRemovals.has(item)) {
        this._items[writeIndex++] = item;
      }
    }
    this._items.length = writeIndex;
    this._pendingRemovals.clear();
  }

  /** Settles a removal batch before coalesced registry notifications run. */
  private _scheduleCompaction(): void {
    if (this._isCompactionScheduled) {
      return;
    }
    this._isCompactionScheduled = true;
    queueMicrotask(() => {
      this._isCompactionScheduled = false;
      this._compact();
    });
  }
}
