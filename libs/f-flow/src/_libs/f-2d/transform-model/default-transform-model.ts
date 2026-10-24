import { ITransformModel } from './i-transform-model';
import { PointExtensions } from '../point';

export function defaultTransformModel(): ITransformModel {
  return {
    position: PointExtensions.initialize(),
    scaledPosition: PointExtensions.initialize(),
    scale: 1,
    rotate: 0,
  };
}
