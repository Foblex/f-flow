import { IArc } from './i-arc';
import { IPoint } from '../point';

export class Arc implements IArc {
  constructor(
    public center: IPoint,
    public radiusX: number,
    public radiusY: number,
    public startAngle: number,
    public endAngle: number,
  ) {}
}
