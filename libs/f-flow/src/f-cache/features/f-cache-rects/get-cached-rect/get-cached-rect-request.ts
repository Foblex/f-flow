import type { IRect } from '@foblex/2d';
export class GetCachedFCacheRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect | undefined;

  static readonly fToken = Symbol('GetCachedFCacheRectRequest');

  constructor(public readonly element: HTMLElement | SVGElement) {}
}
