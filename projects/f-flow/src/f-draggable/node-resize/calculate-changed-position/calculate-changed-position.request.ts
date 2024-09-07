import { IPoint, IRect } from '@foblex/core';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedPositionRequest {

  constructor(
    public originalRect: IRect,
    public changedRect: IRect,
    public difference: IPoint,
    public fResizeHandleType: EFResizeHandleType,
  ) {
  }
}
