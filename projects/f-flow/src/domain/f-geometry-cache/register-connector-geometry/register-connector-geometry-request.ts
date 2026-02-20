export class RegisterConnectorGeometryRequest {
  static readonly fToken = Symbol('RegisterConnectorGeometryRequest');

  constructor(
    public readonly connectorId: string,
    public readonly nodeId: string,
    public readonly elementRef: HTMLElement | SVGElement | undefined,
  ) {}
}
