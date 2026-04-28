import { IRect, RectExtensions } from '@foblex/2d';
import { IReflowCandidate } from '../selection';
import {
  IFReflowCollisionResolver,
  IReflowRawShift,
  IReflowResolvedShift,
} from './i-f-reflow-collision-resolver';

/**
 * STOP collision: a candidate shifts in its requested direction up to the
 * point where its post-shift rect would violate the configured spacing
 * against any non-shifting obstacle. Remaining delta is discarded.
 *
 * Obstacles considered:
 * - The resized node at its `nextRect`.
 * - Every pool member that is not itself shifting on this plan.
 *
 * Obstacles only block on axes where the candidate and obstacle share
 * perpendicular overlap — nodes side-by-side do not block each other on
 * the vertical axis, and nodes stacked vertically do not block on the
 * horizontal axis.
 */
export class StopCollisionResolver implements IFReflowCollisionResolver {
  public resolve({
    sourceNextRect,
    rawShifts,
    pool,
    spacing,
    maxAbsoluteShift,
  }: {
    sourceNextRect: IRect;
    rawShifts: IReflowRawShift[];
    pool: IReflowCandidate[];
    spacing: { vertical: number; horizontal: number };
    maxAbsoluteShift: number;
  }): IReflowResolvedShift[] {
    const shiftingIds = new Set(rawShifts.map((s) => s.candidate.id));
    // Source is the *cause* of the shift, not an obstacle: its resize drives
    // candidates away from it, and treating it as a spacing-enforcing wall
    // can block legitimate shifts (e.g. on collapse when the original
    // source-candidate gap is smaller than the configured spacing).
    // Obstacles are non-moving nodes outside the shift pool.
    const obstacles: IRect[] = pool.filter((c) => !shiftingIds.has(c.id)).map((c) => c.rect);
    // Reference retained to keep the parameter in use across future axes.
    void sourceNextRect;

    const resolved: IReflowResolvedShift[] = [];

    for (const raw of rawShifts) {
      const rect = raw.candidate.rect;

      let dx = raw.shift.x;
      let dy = raw.shift.y;

      if (dy !== 0) {
        dy = this._clampVerticalShift(rect, dy, obstacles, spacing.vertical);
      }

      if (dx !== 0) {
        dx = this._clampHorizontalShift(rect, dx, obstacles, spacing.horizontal);
      }

      dx = this._clampAbs(dx, maxAbsoluteShift);
      dy = this._clampAbs(dy, maxAbsoluteShift);

      if (dx === 0 && dy === 0) {
        continue;
      }

      const toRect = RectExtensions.initialize(rect.x + dx, rect.y + dy, rect.width, rect.height);

      resolved.push({
        candidate: raw.candidate,
        fromRect: rect,
        toRect,
        toPosition: { x: rect.x + dx, y: rect.y + dy },
      });
    }

    return resolved;
  }

  private _clampVerticalShift(
    rect: IRect,
    dy: number,
    obstacles: IRect[],
    spacing: number,
  ): number {
    if (dy > 0) {
      let maxDy = dy;
      for (const obs of obstacles) {
        if (!this._overlapsOnX(rect, obs)) continue;
        if (obs.y < rect.y + rect.height) continue;
        const availableGap = obs.y - (rect.y + rect.height);
        const maxForThis = Math.max(0, availableGap - spacing);
        if (maxForThis < maxDy) maxDy = maxForThis;
      }

      return maxDy;
    }

    let minDy = dy;
    for (const obs of obstacles) {
      if (!this._overlapsOnX(rect, obs)) continue;
      if (obs.y + obs.height > rect.y) continue;
      const availableGap = rect.y - (obs.y + obs.height);
      const minForThis = Math.min(0, -(availableGap - spacing));
      if (minForThis > minDy) minDy = minForThis;
    }

    return minDy;
  }

  private _clampHorizontalShift(
    rect: IRect,
    dx: number,
    obstacles: IRect[],
    spacing: number,
  ): number {
    if (dx > 0) {
      let maxDx = dx;
      for (const obs of obstacles) {
        if (!this._overlapsOnY(rect, obs)) continue;
        if (obs.x < rect.x + rect.width) continue;
        const availableGap = obs.x - (rect.x + rect.width);
        const maxForThis = Math.max(0, availableGap - spacing);
        if (maxForThis < maxDx) maxDx = maxForThis;
      }

      return maxDx;
    }

    let minDx = dx;
    for (const obs of obstacles) {
      if (!this._overlapsOnY(rect, obs)) continue;
      if (obs.x + obs.width > rect.x) continue;
      const availableGap = rect.x - (obs.x + obs.width);
      const minForThis = Math.min(0, -(availableGap - spacing));
      if (minForThis > minDx) minDx = minForThis;
    }

    return minDx;
  }

  private _overlapsOnX(a: IRect, b: IRect): boolean {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }

  private _overlapsOnY(a: IRect, b: IRect): boolean {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }

  private _clampAbs(value: number, max: number): number {
    if (value > max) return max;
    if (value < -max) return -max;

    return value;
  }
}
