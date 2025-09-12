import { FConnectorBase } from '../../../f-connectors';

export class UnmarkConnectableConnectorsRequest {
  static readonly fToken = Symbol('UnmarkConnectableConnectorsRequest');

  constructor(
    public fConnectors: FConnectorBase[],
  ) {
  }
}
