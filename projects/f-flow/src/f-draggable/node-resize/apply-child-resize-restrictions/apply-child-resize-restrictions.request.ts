import { IRect } from '@foblex/core';

export class ApplyChildResizeRestrictionsRequest {

  constructor(
    public rect: IRect,
    public restrictionsRect: IRect,
  ) {
  }
}
