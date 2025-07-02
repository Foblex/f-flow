export class GetNormalizedConnectorRectRequest {
  static readonly fToken = Symbol('GetNormalizedConnectorRectRequest');

  constructor(
        public element: HTMLElement | SVGElement,
    ) {
    }
}
