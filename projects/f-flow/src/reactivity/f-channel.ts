import { FChannelListener } from './types';

export class FChannel {

  protected _listeners = new Set<FChannelListener>();

  public notify(): void {
    this._listeners.forEach((callback) => callback());
  }

  public listen(callback: FChannelListener): () => void {
    this._listeners.add(callback);

    return () => this.stop(callback);
  }

  public stop(callback: FChannelListener): void {
    this._listeners.delete(callback);
  }
}

