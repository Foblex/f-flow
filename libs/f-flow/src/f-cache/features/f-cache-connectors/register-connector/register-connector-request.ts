export class RegisterFCacheConnectorRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RegisterFCacheConnectorRequest');

  constructor(
    public readonly id: string,
    public readonly nodeId: string,
    public readonly kind: string,
    public readonly element: HTMLElement | SVGElement,
  ) {}
}
