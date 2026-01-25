import { IPoint } from '@foblex/2d';
import { IWaypointCandidate } from '../../../../components';

export function calculatePolylineCandidates(
  polyline: IPoint[],
  chainIndex: number,
): IWaypointCandidate[] {
  if (polyline.length < 2) {
    throw new Error('Polylines must be at least two points');
  }

  const total = polylineTotalLength(polyline);
  if (total <= 0) {
    return [{ point: { ...polyline[0] }, chainIndex }];
  }

  const mid = pointAtPolylineLength(polyline, total / 2);

  return [{ point: mid, chainIndex }];
}

function polylineTotalLength(points: IPoint[]): number {
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    len += dist(points[i], points[i + 1]);
  }

  return len;
}

function pointAtPolylineLength(points: IPoint[], s: number): IPoint {
  let acc = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segLen = dist(a, b);

    if (segLen <= 0) continue;

    if (acc + segLen >= s) {
      const t = (s - acc) / segLen;

      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }

    acc += segLen;
  }

  const last = points[points.length - 1];

  return { x: last.x, y: last.y };
}

function dist(a: IPoint, b: IPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
