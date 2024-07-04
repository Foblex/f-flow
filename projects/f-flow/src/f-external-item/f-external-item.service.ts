import { Injectable } from '@angular/core';
import { FExternalItemBase } from './f-external-item-base';

@Injectable({
  providedIn: 'root'
})
export class FExternalItemService {

  private items: FExternalItemBase[] = [];

  public registerItem(item: FExternalItemBase): void {
    this.items.push(item);
  }

  public getItem(element: HTMLElement | SVGElement): FExternalItemBase | undefined {
    return this.items.find(item => item.hostElement === element);
  }

  public removeItem(item: FExternalItemBase): void {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
