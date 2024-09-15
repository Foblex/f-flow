import { IRect } from '@foblex/2d';

export interface INodeResizeRestrictions {

  parentRect: IRect;

  childRect: IRect | null;
}
