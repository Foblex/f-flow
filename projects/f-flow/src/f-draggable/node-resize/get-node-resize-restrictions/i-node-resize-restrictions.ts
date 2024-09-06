import { IRect } from '@foblex/core';

export interface INodeResizeRestrictions {

  parentRect: IRect;

  childRect: IRect | null;
}
