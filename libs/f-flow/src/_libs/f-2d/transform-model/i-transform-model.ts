import { IPoint } from '../point';

export interface ITransformModel {
  position: IPoint;

  scaledPosition: IPoint;

  scale: number;

  rotate: number;
}
