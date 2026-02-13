export type FInstanceKey<T> = {
  readonly name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly __type?: T;
};

export function fInstanceKey<T>(name: string): FInstanceKey<T> {
  return { name } as FInstanceKey<T>;
}

export class FSingleRegistryBase {
  private readonly _instances = new Map<string, unknown>();

  public get<T>(key: FInstanceKey<T>): T | undefined {
    return this._instances.get(key.name) as T | undefined;
  }

  public require<T>(key: FInstanceKey<T>): T {
    const instance = this.get(key);
    if (!instance) {
      throw new Error(`Instance not found: ${key.name}`);
    }

    return instance;
  }

  public has(key: FInstanceKey<unknown>): boolean {
    return this._instances.has(key.name);
  }

  public add<T>(key: FInstanceKey<T>, instance: T): void {
    if (this._instances.has(key.name)) {
      throw new Error(`${key.name} already exists`);
    }
    this._instances.set(key.name, instance);
  }

  public remove(key: FInstanceKey<unknown>): boolean {
    const existed = this._instances.has(key.name);
    if (!existed) {
      throw new Error(`${key.name} does not exist`);
    }
    this._instances.delete(key.name);

    return true;
  }

  public clear(): void {
    this._instances.clear();
  }
}
