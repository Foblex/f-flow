import { FSourceConnectorBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class CalculateTargetConnectorsToConnectRequest {
  static readonly fToken = Symbol('CalculateTargetConnectorsToConnectRequest');
  constructor(
    public readonly source: FSourceConnectorBase,
    public readonly pointer: IPoint,
  ) {}
}
