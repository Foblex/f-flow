import { IPoint } from '@foblex/2d';
import { ITangent } from './i-tangent';

/**
 * Immutable polyline geometry with precomputed cumulative lengths and segment tangents.
 * Keep this class focused on geometry only; sampling/traversal lives in PolylineSampler.
 */
export class Polyline {
  /** Cleaned points (with consecutive duplicates removed). */
  public readonly points: IPoint[];
  /** Cumulative length from start to each vertex. Same length as `points`. */
  public readonly cumulativeLengths: number[];
  /** Unit tangent per segment `i` for segment [i -> i+1]. Length = points.length - 1. */
  public readonly segmentTangents: ITangent[];
  /** Total length of the polyline (>= 1 for the degenerate fallback). */
  public readonly totalLength: number;

  /**
   * Construct a polyline from raw points.
   * Consecutive duplicate points are removed.
   * If less than 2 points remain, it falls back to a unit horizontal segment [0,0] → [1,0].
   */
  constructor(points: IPoint[]) {
    const cleaned = Polyline._removeConsecutiveDuplicates(points);

    if (cleaned.length < 2) {
      // Fallback to a unit segment to avoid zero-length edge cases.
      this.points = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
      this.cumulativeLengths = [0, 1];
      this.segmentTangents = [{ x: 1, y: 0 }];
      this.totalLength = 1;

      return;
    }

    this.points = cleaned;

    const vertexCount = this.points.length;
    const segmentCount = vertexCount - 1;

    const cumulative: number[] = new Array(vertexCount).fill(0);
    const tangents: ITangent[] = new Array(segmentCount);

    let accumulated = 0;
    for (let i = 0; i < segmentCount; i++) {
      const dx = this.points[i + 1].x - this.points[i].x;
      const dy = this.points[i + 1].y - this.points[i].y;
      const length = Math.hypot(dx, dy);

      const ux = length ? dx / length : 1;
      const uy = length ? dy / length : 0;

      tangents[i] = { x: ux, y: uy };
      accumulated += length;
      cumulative[i + 1] = accumulated;
    }

    this.cumulativeLengths = cumulative;
    this.segmentTangents = tangents;
    this.totalLength = accumulated || 1;
  }

  /**
   * Create a polyline by cloning points (defensive copy).
   * @param points Raw input points; they will be copied and cleaned.
   */
  public static from(points: IPoint[]): Polyline {
    return new Polyline(points.map(p => ({ x: p.x, y: p.y })));
  }

  /** Remove consecutive duplicate points. */
  private static _removeConsecutiveDuplicates(points: IPoint[]): IPoint[] {
    const result: IPoint[] = [];
    for (const p of points) {
      const last = result[result.length - 1];
      if (!last || last.x !== p.x || last.y !== p.y) {
        result.push({ x: p.x, y: p.y });
      }
    }

    return result;
  }
}
