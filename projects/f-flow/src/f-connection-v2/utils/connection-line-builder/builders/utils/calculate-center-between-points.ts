import { IPoint } from '@foblex/2d';

export function calculateCenterBetweenPoints(source: IPoint, target: IPoint): IPoint {
  const offsetX = Math.abs(target.x - source.x) / 2;
  const centerX = target.x < source.x ? target.x + offsetX : target.x - offsetX;

  const offsetY = Math.abs(target.y - source.y) / 2;
  const centerY = target.y < source.y ? target.y + offsetY : target.y - offsetY;

  return { x: centerX, y: centerY };
}
