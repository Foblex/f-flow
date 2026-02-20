export class RegisterNodeGeometryRequest {
  static readonly fToken = Symbol('RegisterNodeGeometryRequest');

  constructor(
    public readonly nodeId: string,
    public readonly elementRef: HTMLElement | SVGElement | undefined,
  ) {}
}
