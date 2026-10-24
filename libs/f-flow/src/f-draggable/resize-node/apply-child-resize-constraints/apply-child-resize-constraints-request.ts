import { IRect } from '@foblex/2d';

export class ApplyChildResizeConstraintsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ApplyChildResizeConstraintsRequest');

  constructor(
    public readonly rect: IRect,
    public readonly childrenBounds: IRect | null,
  ) {}
}
