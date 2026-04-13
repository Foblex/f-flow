import { IPoint } from '@foblex/2d';

export function normalizePolyline(points: IPoint[], eps = 1e-6): IPoint[] {
  const n = points.length;
  if (n <= 2) return points;

  const tmp: IPoint[] = [];
  tmp.push(points[0]);

  for (let i = 1; i < n; i++) {
    const p = points[i];
    const last = tmp[tmp.length - 1];

    if (Math.abs(p.x - last.x) > eps || Math.abs(p.y - last.y) > eps) {
      tmp.push(p);
    }
  }

  if (tmp.length <= 2) return tmp;

  const out: IPoint[] = [];
  out.push(tmp[0]);

  for (let i = 1; i < tmp.length - 1; i++) {
    const a = out[out.length - 1];
    const b = tmp[i];
    const c = tmp[i + 1];

    const collinearX = Math.abs(a.x - b.x) <= eps && Math.abs(b.x - c.x) <= eps;
    const collinearY = Math.abs(a.y - b.y) <= eps && Math.abs(b.y - c.y) <= eps;

    if (!collinearX && !collinearY) out.push(b);
  }

  out.push(tmp[tmp.length - 1]);

  return out;
}
