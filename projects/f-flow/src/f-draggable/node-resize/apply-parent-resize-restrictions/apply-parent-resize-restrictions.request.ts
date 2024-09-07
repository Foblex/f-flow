import { IRect } from '@foblex/core';

export class ApplyParentResizeRestrictionsRequest {

  constructor(
    public rect: IRect,
    public restrictionsRect: IRect,
  ) {
  }
}
