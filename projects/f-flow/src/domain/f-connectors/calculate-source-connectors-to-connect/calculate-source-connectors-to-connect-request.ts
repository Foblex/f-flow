import { FNodeInputBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class CalculateSourceConnectorsToConnectRequest {
  static readonly fToken = Symbol('CalculateSourceConnectorsToConnectRequest');

  constructor(
    public readonly targetConnector: FNodeInputBase,
    public readonly pointerPosition: IPoint,
  ) {}
}
