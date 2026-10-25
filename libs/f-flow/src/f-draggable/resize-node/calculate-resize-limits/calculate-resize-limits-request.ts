import { FNodeBase } from '../../../f-node';
import { IRect } from '../../../_libs/f-2d';
import type { IResizeConstraint } from '../constraint';

export class CalculateResizeLimitsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IResizeConstraint;

  static readonly fToken = Symbol('CalculateResizeLimitsRequest');

  constructor(
    public readonly nodeOrGroup: FNodeBase,
    public readonly rect: IRect,
  ) {}
}
