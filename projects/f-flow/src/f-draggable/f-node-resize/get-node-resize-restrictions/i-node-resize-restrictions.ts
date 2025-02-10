import { IRect, ISize } from '@foblex/2d';

export interface INodeResizeRestrictions {

  parentBounds: IRect;

  childrenBounds: IRect | null;

  minimumSize: ISize;
}
