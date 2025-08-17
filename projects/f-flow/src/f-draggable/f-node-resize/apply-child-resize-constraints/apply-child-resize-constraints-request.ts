import {IRect} from '@foblex/2d';
import {IResizeConstraint} from "../constraint";

export class ApplyChildResizeConstraintsRequest {
  static readonly fToken = Symbol('ApplyChildResizeConstraintsRequest');

  constructor(
    public rect: IRect,
    public constraint: IResizeConstraint
  ) {
  }
}
