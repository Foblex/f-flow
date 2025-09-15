import { FConnectorBase } from '../../../f-connectors';

export class MarkConnectableConnectorsRequest {
  static readonly fToken = Symbol('MarkConnectableConnectorsRequest');

  constructor(public readonly connectors: FConnectorBase[]) {}
}
