import { IPoint } from '../point';
import { ISize } from '../size';

export interface IRect extends IPoint, ISize {
  x: number;

  y: number;

  width: number;

  height: number;

  gravityCenter: IPoint;
}
