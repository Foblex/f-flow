import { IPoint } from '@foblex/2d';

export class UpdateScaleRequest {
  static readonly fToken = Symbol('UpdateScaleRequest');
  constructor(
    public readonly scale: number,
    public readonly toPosition: IPoint,
  ) {}
}
