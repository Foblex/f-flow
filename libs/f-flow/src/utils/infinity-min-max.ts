import { IMinMaxPoint } from '@foblex/2d';

export function infinityMinMax(): IMinMaxPoint {
  return {
    min: { x: -Infinity, y: -Infinity },
    max: { x: Infinity, y: Infinity },
  };
}
