import { IRect } from '@foblex/2d';
import { ICanChangeSelection } from '../../../mixins';

export interface ICanBeSelected {

  element: ICanChangeSelection;

  rect: IRect;
}
