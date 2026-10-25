import { IPoint } from '../point';

export interface IArc {
  center: IPoint;

  radiusX: number;

  radiusY: number;

  startAngle: number;

  endAngle: number;
}
