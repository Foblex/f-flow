export class GetNormalizedConnectorRectRequest {
  static readonly fToken = Symbol('GetNormalizedConnectorRectRequest');

  constructor(
    public readonly element: HTMLElement | SVGElement,
    public readonly cache: boolean = true,
  ) {}
}
