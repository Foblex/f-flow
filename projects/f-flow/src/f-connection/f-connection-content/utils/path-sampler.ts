import { IPoint } from '@foblex/2d';

export class PathSampler {
  private _samples: IPoint[] = [];
  private _cumLen: number[] = [];
  private _segUnit: IPoint[] = [];
  private _totalLen = 1;

  public calculateTotalLength(points: IPoint[]): number {
    const pts: IPoint[] = [];
    for (const p of points) {
      if (!pts.length || pts[pts.length - 1].x !== p.x || pts[pts.length - 1].y !== p.y) {
        pts.push({ x: p.x, y: p.y });
      }
    }
    if (pts.length < 2) {
      this._samples = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ];
      this._cumLen = [0, 1];
      this._segUnit = [{ x: 1, y: 0 }];
      this._totalLen = 1;

      return this._totalLen;
    }

    this._samples = pts;
    const n = pts.length - 1;
    this._cumLen = new Array(n + 1).fill(0);
    this._segUnit = new Array(n);

    let acc = 0;
    for (let i = 0; i < n; i++) {
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      const len = Math.hypot(dx, dy);
      const ux = len ? dx / len : 1;
      const uy = len ? dy / len : 0;

      this._segUnit[i] = { x: ux, y: uy };
      acc += len;
      this._cumLen[i + 1] = acc;
    }
    this._totalLen = acc || 1;

    return this._totalLen;
  }

  public getPointAtLength(progress: number): {
    point: IPoint;
    tangent: { x: number; y: number };
    atEdge: boolean;
  } {
    const total = this._totalLen;
    const target = Math.max(0, Math.min(total, progress * total));

    const eps = 0.5;
    if (target <= eps) {
      return { point: this._samples[0], tangent: this._segUnit[0] ?? { x: 1, y: 0 }, atEdge: true };
    }
    if (total - target <= eps) {
      const last = this._samples.length - 1;

      return {
        point: this._samples[last],
        tangent: this._segUnit[last - 1] ?? { x: 1, y: 0 },
        atEdge: true,
      };
    }

    let lo = 0,
      hi = this._cumLen.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this._cumLen[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const l1 = this._cumLen[i - 1],
      l2 = this._cumLen[i];
    const k = (target - l1) / Math.max(1e-6, l2 - l1);

    const a = this._samples[i - 1],
      b = this._samples[i];
    const point = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    const tangent = this._segUnit[i - 1] ?? { x: 1, y: 0 };

    return { point, tangent, atEdge: false };
  }
}
