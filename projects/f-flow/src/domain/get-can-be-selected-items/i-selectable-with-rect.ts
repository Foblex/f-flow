import { IRect } from '@foblex/2d';
import { ISelectable } from '../../f-connection';

export interface ISelectableWithRect {

  element: ISelectable;

  rect: IRect;
}
