import { IRect } from '@foblex/core';
import { ISelectable } from '../../f-connection';

export interface ISelectableWithRect {

  element: ISelectable;

  rect: IRect;
}
