import { FConnectorBase } from '../../../../f-connectors';
import { IPoint } from '../../../../_libs/f-2d';
import type { EFConnectableSide } from '../../../../f-connection-v2';

export class CalculateConnectableSideByConnectedPositionsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: EFConnectableSide;

  static readonly fToken = Symbol('CalculateConnectableSideByConnectedPositionsRequest');
  constructor(
    public readonly connector: FConnectorBase,
    public readonly pointerPosition?: IPoint,
  ) {}
}
