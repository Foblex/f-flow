import { IPoint } from '@foblex/2d';

export function createSegmentLinePath(points: IPoint[], borderRadius: number): string {
  let path = '';
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    let segment = '';

    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else if (i === points.length - 1) {
      segment = buildLastLineSegment(p);
    } else {
      segment = buildMoveOrLineSegment(i, p);
    }
    path += segment;
  }

  return path;
}

function getBend(a: IPoint, b: IPoint, c: IPoint, size: number): string {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;

    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;

  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

function distance(a: IPoint, b: IPoint): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function buildMoveOrLineSegment(index: number, point: IPoint): string {
  return `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`;
}

function buildLastLineSegment(point: IPoint): string {
  return `L${point.x + 0.0002} ${point.y + 0.0002}`;
}
