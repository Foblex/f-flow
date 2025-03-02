import { IPoint, IRect, ISize } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedPositionRequest {

  constructor(
    public originalRect: IRect,
    public changedRect: IRect,
    public difference: IPoint,
    public minimumSize: ISize,
    public fResizeHandleType: EFResizeHandleType,
  ) {
  }
}
