import { IRect } from '@foblex/2d';
import { IResizeLimits } from "../constraint";

export class ApplyParentResizeConstraintsRequest {
  static readonly fToken = Symbol('ApplyParentResizeConstraintsRequest');

  constructor(
    public rect: IRect,
    public limits: IResizeLimits,
  ) {
  }
}
