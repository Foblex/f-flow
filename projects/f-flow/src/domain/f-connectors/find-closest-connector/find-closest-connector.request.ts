import { IPoint } from '@foblex/2d';
import { IConnectorAndRect } from '../index';

export class FindClosestConnectorRequest {
  static readonly fToken = Symbol('FindClosestConnectorRequest');

  constructor(
    public position: IPoint,
    public connectors: IConnectorAndRect[],
  ) {
  }
}
