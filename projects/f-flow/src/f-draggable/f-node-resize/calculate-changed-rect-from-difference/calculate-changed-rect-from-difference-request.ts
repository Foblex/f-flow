import { IPoint, IRect } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedRectFromDifferenceRequest {
  static readonly fToken = Symbol('CalculateChangedRectFromDifferenceRequest');

  constructor(
    public readonly originalRect: IRect,
    public readonly changedRect: IRect,
    public readonly difference: IPoint,
    public readonly handleType: EFResizeHandleType,
  ) {
  }
}
