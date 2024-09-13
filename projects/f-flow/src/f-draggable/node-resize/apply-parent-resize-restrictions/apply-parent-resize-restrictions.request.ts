import { IRect } from '@foblex/2d';

export class ApplyParentResizeRestrictionsRequest {

  constructor(
    public rect: IRect,
    public restrictionsRect: IRect,
  ) {
  }
}
