export class RegisterFCacheConnectorRequest {
  static readonly fToken = Symbol('RegisterFCacheConnectorRequest');

  constructor(
    public readonly id: string,
    public readonly nodeId: string,
    public readonly kind: string,
    public readonly element: HTMLElement | SVGElement,
  ) {}
}
