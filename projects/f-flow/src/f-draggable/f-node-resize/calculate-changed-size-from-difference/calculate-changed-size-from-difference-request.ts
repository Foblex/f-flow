import { IPoint, IRect } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedSizeFromDifferenceRequest {
  static readonly fToken = Symbol('CalculateChangedSizeFromDifferenceRequest');

  constructor(
    public readonly originalRect: IRect,
    public readonly difference: IPoint,
    public readonly handleType: EFResizeHandleType,
  ) {
  }
}
