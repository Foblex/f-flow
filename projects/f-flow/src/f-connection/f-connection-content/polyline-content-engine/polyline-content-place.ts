import { IPolylineContent } from './i-polyline-content';
import { IPoint } from '@foblex/2d';
import { PolylineSampler } from './polyline-sampler';
import { PolylineContentAlign } from './polyline-content-align';

/**
 * Encapsulates placement logic for a single content item along the path.
 */
export class PolylineContentPlace {
  public compute(
    sampler: PolylineSampler,
    content: IPolylineContent,
  ): { position: IPoint; rotationDeg: number } {
    const progress = this._clamp01(content.position());
    const { point, tangent } = sampler.getPointAtLength(progress);

    // Left-hand normal
    const normal = { x: -tangent.y, y: tangent.x };

    // Apply lateral offset
    const lateral = content.offset() ?? 0;
    const x = point.x + normal.x * lateral;
    const y = point.y + normal.y * lateral;

    // Edge guard
    const projectedSize = this._sizeAlongDirection(content.hostElement, tangent);
    const halfExtent = projectedSize * 0.5;

    const distanceFromStart = progress * sampler.totalLength;
    const distanceFromEnd = sampler.totalLength - distanceFromStart;

    const position = this._applyEdgeGuard(x, y, tangent, distanceFromStart, distanceFromEnd, halfExtent);

    const rotationDeg = this._calculateContentRotation(content.align(), tangent);

    return { position, rotationDeg };
  }

  private _clamp01(v: number): number {
    return v <= 0 ? 0 : v >= 1 ? 1 : v;
  }

  private _applyEdgeGuard(
    x: number,
    y: number,
    tangent: IPoint,
    distanceFromStart: number,
    distanceFromEnd: number,
    halfExtent: number,
  ): IPoint {
    if (distanceFromStart <= halfExtent) {
      const push = halfExtent - distanceFromStart;

      return { x: x + tangent.x * push, y: y + tangent.y * push };
    }
    if (distanceFromEnd <= halfExtent) {
      const push = halfExtent - distanceFromEnd;

      return { x: x - tangent.x * push, y: y - tangent.y * push };
    }

    return { x, y };
  }

  private _sizeAlongDirection(element: HTMLElement, dir: IPoint): number {
    const rect = element.getBoundingClientRect();

    return Math.abs(dir.x) * rect.width + Math.abs(dir.y) * rect.height;
  }

  private _normalize180(angleDeg: number): number {
    let a = (angleDeg + 180) % 360;
    if (a < 0) a += 360;

    return a - 180;
  }

  private _keepUpright(angleDeg: number): number {
    let a = this._normalize180(angleDeg);
    if (a > 90) a -= 180;
    else if (a < -90) a += 180;

    return a;
  }

  private _calculateContentRotation(align: PolylineContentAlign, tangent: IPoint) {
    let result = 0;

    if (align === PolylineContentAlign.ALONG) {
      result = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
      result = this._keepUpright(result);
    }

    return result;
  }
}
