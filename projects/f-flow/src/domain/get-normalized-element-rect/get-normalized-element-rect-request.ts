export class GetNormalizedElementRectRequest {
  static readonly fToken = Symbol('GetNormalizedElementRectRequest');

  constructor(public readonly element: HTMLElement | SVGElement) {}
}
