import { IRect } from '@foblex/2d';
import { ICanChangeSelection } from '../../mixins';

export interface ISelectableWithRect {

  element: ICanChangeSelection;

  rect: IRect;
}
