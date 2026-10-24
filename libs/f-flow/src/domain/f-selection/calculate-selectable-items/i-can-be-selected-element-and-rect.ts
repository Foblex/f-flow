import { IRect } from '../../../_libs/f-2d';
import { ISelectable } from '../../../mixins';

export interface ICanBeSelectedElementAndRect {
  element: ISelectable;

  fRect: IRect;
}
