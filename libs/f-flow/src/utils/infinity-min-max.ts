import { IMinMaxPoint } from '../_libs/f-2d';

export function infinityMinMax(): IMinMaxPoint {
  return {
    min: { x: -Infinity, y: -Infinity },
    max: { x: Infinity, y: Infinity },
  };
}
