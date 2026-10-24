import { IPoint, IRect, ISize } from '@foblex/2d';
import { EFResizeHandleType } from '../../../f-node';

export class CalculateChangedRectFromDifferenceRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect;

  static readonly fToken = Symbol('CalculateChangedRectFromDifferenceRequest');

  constructor(
    public readonly originalRect: IRect,
    public readonly difference: IPoint,
    public readonly handleType: EFResizeHandleType,
    public readonly minimumSize: ISize,
  ) {}
}
