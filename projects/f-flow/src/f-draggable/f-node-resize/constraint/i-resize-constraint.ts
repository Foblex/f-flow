import {IRect, ISize} from '@foblex/2d';
import {IResizeLimits} from "./i-resize-limits";

export interface IResizeConstraint {

  limits: IResizeLimits;

  parentBounds: IRect;

  childrenBounds: IRect | null;

  minimumSize: ISize;
}
