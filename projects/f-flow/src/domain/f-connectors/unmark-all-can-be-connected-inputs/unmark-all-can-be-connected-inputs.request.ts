import { FConnectorBase } from '../../../f-connectors';

export class UnmarkAllCanBeConnectedInputsRequest {

  constructor(
    public fInputs: FConnectorBase[],
  ) {
  }
}
