import { FNodeEntry } from './f-node-entry';
import { INodeGeometryRef } from './i-node-geometry-ref';

export class FNodeGeometryCache {
  private readonly _entries = new Map<string, FNodeEntry>();
  private readonly _idByElement = new WeakMap<Element, string>();

  public register(
    id: string,
    element: HTMLElement | SVGElement,
    reference: INodeGeometryRef,
  ): void {
    const next = new FNodeEntry(id, element, reference);

    this._entries.set(id, next);
    this._idByElement.set(element, id);
  }
}
