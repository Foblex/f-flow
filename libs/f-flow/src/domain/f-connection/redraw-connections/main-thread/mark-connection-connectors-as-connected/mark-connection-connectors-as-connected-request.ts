import { FConnectorBase } from '../../../../../f-connectors';

export class MarkConnectionConnectorsAsConnectedRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('MarkConnectionConnectorsAsConnectedRequest');

  constructor(
    public source: FConnectorBase,
    public target: FConnectorBase,
  ) {}
}
