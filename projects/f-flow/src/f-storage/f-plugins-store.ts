export class FPluginsStore {
  private readonly _instances: Record<string, unknown> = {}

  public add(name: string, instance: unknown): void {
    this._instances[name] = instance;
  }

  public get<T>(name: string): T | undefined {
    return this._instances[name] as T | undefined;
  }

  public remove(name: string): void {
    this._instances[name] = undefined;
  }
}
