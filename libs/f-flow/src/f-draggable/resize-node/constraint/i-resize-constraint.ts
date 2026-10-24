import { IRect, ISize } from '../../../_libs/f-2d';
import { IResizeLimits } from './i-resize-limits';

export interface IResizeConstraint {
  limits: IResizeLimits;

  childrenBounds: IRect | null;

  minimumSize: ISize;
}
