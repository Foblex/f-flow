import { FConnectorBase } from '../../../../f-connectors';

export class CalculateConnectableSideByInternalPositionRequest {
  static readonly fToken = Symbol('CalculateConnectableSideByInternalPositionRequest');
  constructor(public readonly connector: FConnectorBase) {}
}
