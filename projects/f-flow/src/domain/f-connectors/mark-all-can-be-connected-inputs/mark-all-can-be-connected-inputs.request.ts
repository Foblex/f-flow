import { FConnectorBase } from '../../../f-connectors';

export class MarkAllCanBeConnectedInputsRequest {

  constructor(
    public fInputs: FConnectorBase[],
  ) {
  }
}
