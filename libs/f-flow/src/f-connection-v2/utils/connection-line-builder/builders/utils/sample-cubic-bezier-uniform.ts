import { IPoint } from '@foblex/2d';

/**
 * Uniformly samples a cubic Bézier segment.
 *
 * @param points - Start point, First control point, Second control point, End point.
 * @param samples - Number of sub-segments (default: 32). The function returns `samples + 1` points.
 * @returns Array of sampled points including both endpoints.
 * @remarks
 * Sampling is uniform in parameter `t`, not in arc length. This is typically
 * sufficient for hit-testing and bounding boxes; if you need error-bounded
 * flattening, consider an adaptive subdivision strategy instead.
 */
export function sampleCubicBezierUniform(points: IPoint[], samples = 32): IPoint[] {
  const out: IPoint[] = new Array(samples + 1);
  out[0] = { ...points[0] };
  for (let i = 1; i <= samples; i++) {
    out[i] = cubicBezierAtT(points[0], points[1], points[2], points[3], i / samples);
  }

  return out;
}

/**
 * Evaluates a cubic Bézier at parameter `t` in [0, 1].
 *
 * @param p0 - Start point.
 * @param p1 - First control point.
 * @param p2 - Second control point.
 * @param p3 - End point.
 * @param t - Parameter in [0, 1].
 * @returns Point on the curve at `t`.
 */
export function cubicBezierAtT(p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, t: number): IPoint {
  const u = 1 - t,
    tt = t * t,
    uu = u * u,
    uuu = uu * u,
    ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}
