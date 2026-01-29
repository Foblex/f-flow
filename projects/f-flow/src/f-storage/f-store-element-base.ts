export class FStoreElementBase {
  private readonly _instances: unknown[] = [];

  public getAll<T>(): T[] {
    return this._instances as T[];
  }

  public add<T>(instance: T): void {
    this._instances.push(instance);
  }

  public addMultiple<T>(instances: T[]): void {
    this._instances.push(...instances);
  }

  public remove<T>(instance: T): void {
    const index = this._instances.indexOf(instance);
    if (index > -1) {
      this._instances.splice(index, 1);
    }
  }
}
