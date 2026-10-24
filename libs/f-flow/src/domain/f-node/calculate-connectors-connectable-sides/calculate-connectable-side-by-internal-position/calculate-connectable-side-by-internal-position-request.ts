import { FConnectorBase } from '../../../../f-connectors';
import type { EFConnectableSide } from '../../../../f-connection-v2';

export class CalculateConnectableSideByInternalPositionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: EFConnectableSide;

  static readonly fToken = Symbol('CalculateConnectableSideByInternalPositionRequest');
  constructor(public readonly connector: FConnectorBase) {}
}
