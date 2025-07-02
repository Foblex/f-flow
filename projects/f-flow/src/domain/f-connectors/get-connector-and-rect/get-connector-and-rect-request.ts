import { FConnectorBase } from '../../../f-connectors';

export class GetConnectorAndRectRequest {
  static readonly fToken = Symbol('GetConnectorAndRectRequest');
  constructor(
    public fConnector: FConnectorBase
  ) {
  }
}
