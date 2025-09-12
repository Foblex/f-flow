import { IPoint } from '@foblex/2d';

export class UpdateScaleRequest {
  static readonly fToken = Symbol('UpdateScaleRequest');
  constructor(
    public scale: number,
    public toPosition: IPoint,
  ) {
  }
}
