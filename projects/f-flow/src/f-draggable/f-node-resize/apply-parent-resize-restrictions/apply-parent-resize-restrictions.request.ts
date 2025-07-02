import { IRect } from '@foblex/2d';

export class ApplyParentResizeRestrictionsRequest {
  static readonly fToken = Symbol('ApplyParentResizeRestrictionsRequest');
  constructor(
    public rect: IRect,
    public restrictionsRect: IRect,
  ) {
  }
}
