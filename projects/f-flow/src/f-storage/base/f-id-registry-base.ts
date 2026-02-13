export interface FHasId {
  fId(): string;
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
    return this._items;
  }

  public size(): number {
    return this._items.length;
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

    const index = this._items.indexOf(existing);
    if (index >= 0) {
      this._items.splice(index, 1);
    }

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

    const index = this._items.indexOf(existing);
    if (index >= 0) {
      this._items.splice(index, 1);
    }

    return existing;
  }

  /**
   * Clears registry (does NOT touch other state outside).
   */
  public clear(): void {
    this._items.length = 0;
    this._byId.clear();
  }
}
