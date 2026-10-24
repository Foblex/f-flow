import type { IRect } from '@foblex/2d';
export class GetNormalizedElementRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect;

  static readonly fToken = Symbol('GetNormalizedElementRectRequest');

  constructor(public readonly element: HTMLElement | SVGElement) {}
}
