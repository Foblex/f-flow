import { Injectable } from '@angular/core';
import { FExternalItemBase } from './f-external-item-base';

@Injectable({
  providedIn: 'root',
})
export class FExternalItemService {
  private readonly _items: FExternalItemBase[] = [];

  public registerItem(item: FExternalItemBase): void {
    this._items.push(item);
  }

  public getItem(element: HTMLElement | SVGElement): FExternalItemBase | undefined {
    return this._items.find((item) => item.hostElement === element);
  }

  public removeItem(item: FExternalItemBase): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }
}
