import { IPoint } from '@foblex/2d';

export function createAdaptiveCurvePath(points: IPoint[]): string {
  return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x + 0.0002} ${points[3].y + 0.0002}`;
}
