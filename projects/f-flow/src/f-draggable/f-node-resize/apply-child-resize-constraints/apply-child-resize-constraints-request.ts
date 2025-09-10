import { IRect } from '@foblex/2d';

export class ApplyChildResizeConstraintsRequest {
  static readonly fToken = Symbol('ApplyChildResizeConstraintsRequest');

  constructor(
    public readonly rect: IRect,
    public readonly childrenBounds: IRect | null,
  ) {
  }
}
