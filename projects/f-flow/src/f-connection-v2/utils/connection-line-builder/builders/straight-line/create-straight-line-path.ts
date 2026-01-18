import { IPoint } from '@foblex/2d';

export function createStraightLinePath(points: IPoint[]): string {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const p = points[i];

    const isLast = i === points.length - 1;
    const x = isLast ? p.x + 0.0002 : p.x;
    const y = isLast ? p.y + 0.0002 : p.y;

    d += ` L ${x} ${y}`;
  }

  return d;
}
