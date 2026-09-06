import { IPoint } from '@foblex/2d';

const EPS = 1e-6;
const END_EPS = 0.0002;
const MIN_VISIBLE = 0.75;

export function createSegmentLinePath(points: IPoint[], borderRadius: number): string {
  const n = points.length;
  const parts: string[] = [];
  parts.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 1; i < n - 1; i++) {
    parts.push(getBend(points[i - 1], points[i], points[i + 1], borderRadius));
  }

  const last = points[n - 1];
  parts.push(`L ${last.x + END_EPS} ${last.y + END_EPS}`);

  return parts.join(' ');
}

/**
 * The point of the rendered path closest to corner `b` — the apex of the
 * rounded bend `getBend` produces for it, or `b` itself when the corner is
 * rendered sharp. Uses the same bend-size clamping as `getBend`, so the
 * result always lies on the path.
 */
export function calculateCornerApex(a: IPoint, b: IPoint, c: IPoint, size: number): IPoint {
  if (size <= 0) {
    return { x: b.x, y: b.y };
  }

  const collinearX = Math.abs(a.x - b.x) <= EPS && Math.abs(b.x - c.x) <= EPS;
  const collinearY = Math.abs(a.y - b.y) <= EPS && Math.abs(b.y - c.y) <= EPS;
  if (collinearX || collinearY) {
    return { x: b.x, y: b.y };
  }

  const ab = Math.hypot(b.x - a.x, b.y - a.y);
  const bc = Math.hypot(c.x - b.x, c.y - b.y);

  const bendSize = Math.min(ab * 0.5, bc * 0.5, size);

  if (bendSize < MIN_VISIBLE || ab === 0 || bc === 0) {
    return { x: b.x, y: b.y };
  }

  // The bend is a quadratic from (b - bendSize*din) to (b + bendSize*dout)
  // with control b; its apex at t = 0.5 is b + 0.25 * bendSize * (dout - din).
  const dinX = (b.x - a.x) / ab;
  const dinY = (b.y - a.y) / ab;
  const doutX = (c.x - b.x) / bc;
  const doutY = (c.y - b.y) / bc;

  return {
    x: b.x + 0.25 * bendSize * (doutX - dinX),
    y: b.y + 0.25 * bendSize * (doutY - dinY),
  };
}

function getBend(a: IPoint, b: IPoint, c: IPoint, size: number): string {
  const x = b.x;
  const y = b.y;

  if (size <= 0) {
    return `L ${x} ${y}`;
  }

  const collinearX = Math.abs(a.x - x) <= EPS && Math.abs(x - c.x) <= EPS;
  const collinearY = Math.abs(a.y - y) <= EPS && Math.abs(y - c.y) <= EPS;
  if (collinearX || collinearY) {
    return `L ${x} ${y}`;
  }

  const ab = Math.hypot(x - a.x, y - a.y);
  const bc = Math.hypot(c.x - x, c.y - y);

  const bendSize = Math.min(ab * 0.5, bc * 0.5, size);

  if (bendSize < MIN_VISIBLE) {
    return `L ${x} ${y}`;
  }

  const incomingHorizontal = Math.abs(a.y - y) <= EPS;

  if (incomingHorizontal) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;

    const lx = x + bendSize * xDir;
    const qy = y + bendSize * yDir;

    return `L ${lx} ${y} Q ${x} ${y} ${x} ${qy}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;

  const ly = y + bendSize * yDir;
  const qx = x + bendSize * xDir;

  return `L ${x} ${ly} Q ${x} ${y} ${qx} ${y}`;
}
