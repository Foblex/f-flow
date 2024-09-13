import { IPoint, IRect } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedSizeRequest {

  constructor(
    public originalRect: IRect,
    public difference: IPoint,
    public fResizeHandleType: EFResizeHandleType,
  ) {
  }
}
