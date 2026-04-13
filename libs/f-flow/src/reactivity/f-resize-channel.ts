import { FChannelListener } from './types';
import { FChannel } from './f-channel';

export class FResizeChannel extends FChannel {

  private readonly _observer = new ResizeObserver(() => this.notify());

  private _isObserving = false;

  constructor(
    private readonly _htmlElement: HTMLElement | SVGElement,
  ) {
    super();
  }

  public override listen(callback: FChannelListener): () => void {
    if (!this._isObserving) {
      this._observer.observe(this._htmlElement);
      this._isObserving = true;
    }

    return super.listen(callback);
  }

  public override stop(callback: FChannelListener): void {
    super.stop(callback);
    if (this._listeners.size === 0) {
      this._disconnect();
    }
  }

  private _disconnect(): void {
    this._observer.unobserve(this._htmlElement);
    this._observer.disconnect();
    this._isObserving = false;
  }
}
