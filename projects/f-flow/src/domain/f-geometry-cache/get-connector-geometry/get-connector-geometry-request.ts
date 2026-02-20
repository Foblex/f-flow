export class GetConnectorGeometryRequest {
  static readonly fToken = Symbol('GetConnectorGeometryRequest');

  constructor(public readonly connectorId: string) {}
}
