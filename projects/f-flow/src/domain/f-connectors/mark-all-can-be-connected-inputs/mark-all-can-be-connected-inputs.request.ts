import { FConnectorBase } from '../../../f-connectors';

export class MarkAllCanBeConnectedInputsRequest {
  static readonly fToken = Symbol('MarkAllCanBeConnectedInputsRequest');
  constructor(
    public fInputs: FConnectorBase[],
  ) {
  }
}
