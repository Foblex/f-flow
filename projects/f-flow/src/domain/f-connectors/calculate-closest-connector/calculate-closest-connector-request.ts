import { IPoint } from '@foblex/2d';
import { IConnectorAndRect } from '../index';

export class CalculateClosestConnectorRequest {
  static readonly fToken = Symbol('CalculateClosestConnectorRequest');

  constructor(
    public readonly position: IPoint,
    public readonly connectors: IConnectorAndRect[],
  ) {}
}
