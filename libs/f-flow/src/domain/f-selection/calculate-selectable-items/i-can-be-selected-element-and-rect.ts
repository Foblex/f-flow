import { IRect } from '@foblex/2d';
import { ISelectable } from '../../../mixins';

export interface ICanBeSelectedElementAndRect {
  element: ISelectable;

  fRect: IRect;
}
