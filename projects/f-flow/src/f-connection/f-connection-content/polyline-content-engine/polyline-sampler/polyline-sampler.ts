import { Polyline } from './polyline';
import { IPoint } from '@foblex/2d';
import { ISamplerResult } from './i-sampler-result';

/**
 * Provides sampling (interpolation) along a {@link Polyline}.
 * Separates traversal logic from pure geometry stored in {@link Polyline}.
 */
export class PolylineSampler {
  private _polyline: Polyline;

  /**
   * @param points Initial points to build the underlying polyline.
   *               You can later call {@link updatePoints} to rebuild.
   */
  constructor(points: IPoint[] = []) {
    this._polyline = new Polyline(points);
  }

  /**
   * Rebuild the underlying polyline from new points.
   * @returns Total length of the rebuilt polyline.
   */
  public updatePoints(points: IPoint[]): number {
    this._polyline = new Polyline(points);

    return this._polyline.totalLength;
  }

  /**
   * Backward-compatible alias for older API naming.
   * @returns Total length of the rebuilt polyline.
   */
  public calculateTotalLength(points: IPoint[]): number {
    return this.updatePoints(points);
  }

  /** Total length of the current polyline. */
  public get totalLength(): number {
    return this._polyline.totalLength;
  }

  /**
   * Sample a point by normalized progress along the whole length.
   *
   * - `progress = 0` → start vertex
   * - `progress = 1` → end vertex
   *
   * Uses a small edge threshold (0.5 units) to snap near-start/near-end queries to exact vertices,
   * mirroring the behavior in the original implementation.
   *
   * @param progress Normalized value in [0..1]. Values are clamped to this range.
   * @returns Interpolated point, segment tangent, and whether it was clamped to an edge.
   */
  public getPointAtProgress(progress: number): ISamplerResult {
    const { points, cumulativeLengths, segmentTangents, totalLength } = this._polyline;

    const clamped = PolylineSampler._clamp(progress, 0, 1);
    const target = clamped * totalLength;

    const edgeThreshold = 0.5;
    if (target <= edgeThreshold) {
      return {
        point: points[0],
        tangent: segmentTangents[0] ?? { x: 1, y: 0 },
        atEdge: true,
      };
    }
    if (totalLength - target <= edgeThreshold) {
      const last = points.length - 1;

      return {
        point: points[last],
        tangent: segmentTangents[last - 1] ?? { x: 1, y: 0 },
        atEdge: true,
      };
    }

    const rightIndex = PolylineSampler._findRightIndex(cumulativeLengths, target);
    const i = Math.max(1, rightIndex);

    const leftLen = cumulativeLengths[i - 1];
    const rightLen = cumulativeLengths[i];
    const t = PolylineSampler._safeRatio(target - leftLen, rightLen - leftLen);

    const a = points[i - 1];
    const b = points[i];
    const point = {
      x: PolylineSampler._lerp(a.x, b.x, t),
      y: PolylineSampler._lerp(a.y, b.y, t),
    };
    const tangent = segmentTangents[i - 1] ?? { x: 1, y: 0 };

    return { point, tangent, atEdge: false };
  }

  /**
   * Backward-compatible alias.
   * Equivalent to {@link getPointAtProgress}.
   */
  public getPointAtLength(progress: number): ISamplerResult {
    return this.getPointAtProgress(progress);
  }

  /**
   * Sample a point by absolute distance from the start (in the same units as your points).
   * This is a convenience wrapper over {@link getPointAtProgress}.
   *
   * @param distance Distance from 0 to {@link totalLength}. Values outside are clamped.
   * @returns Interpolated point, segment tangent, and whether it was clamped to an edge.
   */
  public getPointAtDistance(distance: number): ISamplerResult {
    const progress = this._polyline.totalLength ? distance / this._polyline.totalLength : 0;

    return this.getPointAtProgress(progress);
  }

  // =============== Internal utilities ===============

  /** Binary-search the first index where cumulativeLengths[index] >= target. */
  private static _findRightIndex(cumulativeLengths: number[], target: number): number {
    let lo = 0;
    let hi = cumulativeLengths.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulativeLengths[mid] < target) lo = mid + 1;
      else hi = mid;
    }

    return lo;
  }

  /** Linear interpolation between `a` and `b`. */
  private static _lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /** Clamp `value` into [min, max]. */
  private static _clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
  }

  /** Safe ratio `num / den` with tiny-denominator guard. */
  private static _safeRatio(num: number, den: number): number {
    const d = Math.abs(den) < 1e-6 ? 1e-6 : den;

    return num / d;
  }
}

/* ============================
   Example
===============================
const sampler = new PolylineSampler([
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
]);

console.log('Total length:', sampler.totalLength); // -> 20

const s1 = sampler.getPointAtProgress(0.25);
console.log(s1.point, s1.tangent, s1.atEdge);

const s2 = sampler.getPointAtDistance(15); // same as progress 0.75
console.log(s2.point, s2.tangent, s2.atEdge);
*/
