import { IPoint } from '@foblex/2d';

export class GetNormalizedPointRequest {
  static readonly fToken = Symbol('GetNormalizedPointRequest');

  constructor(
    public position: IPoint,
  ) {
  }
}
