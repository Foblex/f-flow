export class FEventNotifier {

  private _listeners: Map<number, { listener: () => void; debounce?: number; timer?: any }> = new Map();
  private _nextId = 0;

  public emit(): void {
    this._listeners.forEach((config) => {
      const { listener, debounce } = config;

      if (debounce) {
        if (config.timer) {
          clearTimeout(config.timer);
        }

        config.timer = setTimeout(() => {
          listener();
          config.timer = undefined;
        }, debounce);
      } else {
        listener();
      }
    });
  }

  public subscribe(listener: () => void, debounce?: number): number {
    const id = this._nextId++;
    this._listeners.set(id, { listener, debounce });
    return id;
  }

  public unsubscribe(id: number): void {
    this._listeners.delete(id);
  }
}
