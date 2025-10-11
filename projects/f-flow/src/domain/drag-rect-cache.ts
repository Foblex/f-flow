import { IRect, RectExtensions } from '@foblex/2d';

export class DragRectCache {
  private static _cache = new WeakMap<Element, IRect>();

  public static fromElement(element: HTMLElement | SVGElement): IRect {
    const rect = this._cache.get(element) || RectExtensions.fromElement(element);
    this._cache.set(element, rect);

    return rect;
  }

  public static set(element: HTMLElement | SVGElement): void {
    this._cache.set(element, RectExtensions.fromElement(element));
  }

  public static invalidate(element: HTMLElement | SVGElement): void {
    this._cache.delete(element);
  }

  public static invalidateAll(): void {
    this._cache = new WeakMap<Element, IRect>();
  }
}
