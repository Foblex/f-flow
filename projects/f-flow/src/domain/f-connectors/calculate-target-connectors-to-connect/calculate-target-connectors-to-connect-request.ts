import { FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class CalculateTargetConnectorsToConnectRequest {
  static readonly fToken = Symbol('CalculateTargetConnectorsToConnectRequest');
  constructor(
    public readonly source: FNodeOutputBase | FNodeOutletBase,
    public readonly pointer: IPoint,
  ) {}
}
