export class GetNormalizedElementRectRequest {
  static readonly fToken = Symbol('GetNormalizedElementRectRequest');

  constructor(
        public element: HTMLElement | SVGElement,
    ) {
    }
}
