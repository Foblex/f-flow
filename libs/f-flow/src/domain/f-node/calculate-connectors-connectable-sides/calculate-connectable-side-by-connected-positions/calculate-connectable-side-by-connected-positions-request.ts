import { FConnectorBase } from '../../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class CalculateConnectableSideByConnectedPositionsRequest {
  static readonly fToken = Symbol('CalculateConnectableSideByConnectedPositionsRequest');
  constructor(
    public readonly connector: FConnectorBase,
    public readonly pointerPosition?: IPoint,
  ) {}
}
