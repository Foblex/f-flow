import { IPoint } from '@foblex/2d';

export class CalculateConnectionCenterRequest {
  static readonly fToken = Symbol('CalculateConnectionCenterRequest');

  constructor(
    public points: IPoint[],
  ) {
  }
}
