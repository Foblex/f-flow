import { IRect } from '@foblex/2d';

export class ApplyChildResizeRestrictionsRequest {

  constructor(
    public rect: IRect,
    public restrictionsRect: IRect,
  ) {
  }
}
