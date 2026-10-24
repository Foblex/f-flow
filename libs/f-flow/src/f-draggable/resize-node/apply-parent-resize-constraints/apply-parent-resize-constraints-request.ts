import { IRect } from '@foblex/2d';
import { IResizeLimits } from '../constraint';

export class ApplyParentResizeConstraintsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ApplyParentResizeConstraintsRequest');

  constructor(
    public rect: IRect,
    public limits: IResizeLimits,
  ) {}
}
