export class GetCachedFCacheRectRequest {
  static readonly fToken = Symbol('GetCachedFCacheRectRequest');

  constructor(public readonly element: HTMLElement | SVGElement) {}
}
