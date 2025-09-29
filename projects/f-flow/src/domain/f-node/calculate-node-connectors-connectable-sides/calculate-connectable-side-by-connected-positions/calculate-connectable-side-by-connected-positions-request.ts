import { FConnectorBase } from '../../../../f-connectors';

export class CalculateConnectableSideByConnectedPositionsRequest {
  static readonly fToken = Symbol('CalculateConnectableSideByConnectedPositionsRequest');
  constructor(public readonly connector: FConnectorBase) {}
}
