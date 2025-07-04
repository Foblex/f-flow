import { IPoint, IRect } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedPositionRequest {
  static readonly fToken = Symbol('CalculateChangedPositionRequest');

  constructor(
    public originalRect: IRect,
    public changedRect: IRect,
    public difference: IPoint,
    public fResizeHandleType: EFResizeHandleType,
  ) {
  }
}
