import { IPoint } from '@foblex/2d';

export class CalculateCenterBetweenPointsRequest {
  static readonly fToken = Symbol('CalculateCenterBetweenPointsRequest');

  constructor(
    public source: IPoint,
    public target: IPoint,
  ) {
  }
}
