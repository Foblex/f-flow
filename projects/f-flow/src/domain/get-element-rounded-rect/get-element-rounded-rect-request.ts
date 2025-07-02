export class GetElementRoundedRectRequest {
  static readonly fToken = Symbol('GetElementRoundedRectRequest');
  constructor(
    public element: HTMLElement | SVGElement,
  ) {
  }
}
