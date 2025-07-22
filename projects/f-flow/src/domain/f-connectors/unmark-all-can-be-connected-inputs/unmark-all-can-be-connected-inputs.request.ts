import {FConnectorBase} from '../../../f-connectors';

export class UnmarkAllCanBeConnectedInputsRequest {
  static readonly fToken = Symbol('UnmarkAllCanBeConnectedInputsRequest');

  constructor(
    public fConnectors: FConnectorBase[],
  ) {
  }
}
