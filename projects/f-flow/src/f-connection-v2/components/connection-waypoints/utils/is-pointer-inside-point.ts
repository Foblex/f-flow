import { IPoint } from '@foblex/2d';

export function isPointerInsidePoint(point: IPoint, circleCenter: IPoint, radius: number): boolean {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= radius ** 2;
}
