import { computed, Injectable, signal } from '@angular/core';
import { FExternalItemBase } from './f-external-item-base';
import { getExternalItemHost } from './is-external-item';

@Injectable({
  providedIn: 'root',
})
export class FExternalItemService {
  private readonly _byHost = new Map<HTMLElement | SVGElement, FExternalItemBase>();
  private readonly _items = signal<readonly FExternalItemBase[]>([]);

  /** Reactive list (internal consumers) */
  public readonly items = computed(() => this._items());

  /** lookup by element (supports passing a nested child) */
  public getByElement(el: HTMLElement | SVGElement): FExternalItemBase | undefined {
    const host = getExternalItemHost(el);

    return host ? this._byHost.get(host) : undefined;
  }

  /** lookup by host */
  public getByHost(host: HTMLElement | SVGElement): FExternalItemBase | undefined {
    return this._byHost.get(host);
  }

  public register(item: FExternalItemBase): void {
    const host = item.hostElement;

    const existing = this._byHost.get(host);
    if (existing === item) {
      return; // idempotent
    }

    // if same host got re-created (HMR / rerender), replace
    if (existing && existing !== item) {
      this._byHost.delete(host);
    }

    this._byHost.set(host, item);
    this._sync();
  }

  public remove(item: FExternalItemBase): void {
    const host = item.hostElement;
    if (this._byHost.get(host) !== item) {
      return; // already removed/replaced
    }

    this._byHost.delete(host);
    this._sync();
  }

  private _sync(): void {
    // new array reference => signal change
    this._items.set([...this._byHost.values()]);
  }
}
