import { IRect, ISize } from '@foblex/2d';
import { IResizeLimits } from "./i-resize-limits";

export interface IResizeConstraint {

  limits: IResizeLimits;

  childrenBounds: IRect | null;

  minimumSize: ISize;
}
