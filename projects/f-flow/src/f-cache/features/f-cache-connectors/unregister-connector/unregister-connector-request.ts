export class UnregisterFCacheConnectorRequest {
  static readonly fToken = Symbol('UnregisterFCacheConnectorRequest');

  constructor(
    public readonly connectorId: string,
    public readonly kind: string,
  ) {}
}
