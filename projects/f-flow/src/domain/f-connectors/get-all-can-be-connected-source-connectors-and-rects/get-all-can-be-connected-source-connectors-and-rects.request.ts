import { FNodeInputBase } from '../../../f-connectors';

export class GetAllCanBeConnectedSourceConnectorsAndRectsRequest {
  static readonly fToken = Symbol('GetAllCanBeConnectedSourceConnectorsAndRectsRequest');

  constructor(
    public fTargetConnector: FNodeInputBase,
  ) {
  }
}
