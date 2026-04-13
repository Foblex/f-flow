import { FConnectorBase } from '../../../../../f-connectors';

export class MarkConnectionConnectorsAsConnectedRequest {
  static readonly fToken = Symbol('MarkConnectionConnectorsAsConnectedRequest');

  constructor(
    public source: FConnectorBase,
    public target: FConnectorBase,
  ) {}
}
