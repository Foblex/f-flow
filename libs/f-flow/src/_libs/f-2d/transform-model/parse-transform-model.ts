import { ITransformModel } from './i-transform-model';
import { PointExtensions } from '../point';

export function parseTransformModel(value: string | null): ITransformModel | undefined {
  let result: ITransformModel | undefined;

  if (value) {
    value = value.replace('matrix(', '');
    value = value.replace(')', '');
    const values = value.split(' ');

    result = {
      position: {
        x: Number(values[4]),
        y: Number(values[5]),
      },
      scaledPosition: PointExtensions.initialize(),
      scale: Number(values[0]),
      rotate: 0,
    };
  }

  return result;
}
