import { IRect, RectExtensions } from '@foblex/2d';
import { IReflowCandidate } from '../selection';
import {
  IFReflowCollisionResolver,
  IReflowRawShift,
  IReflowResolvedShift,
} from './i-f-reflow-collision-resolver';

interface IChainPushEntry {
  candidate: IReflowCandidate;
  dx: number;
  dy: number;
  toRect: IRect;
}

/**
 * CHAIN_PUSH collision: when a shifting candidate would collide with a
 * non-shifting pool member, the colliding node is *included* in the
 * plan and pushed away by enough to restore spacing — instead of
 * clamping the original shift like `STOP` would.
 *
 * The pushed node may itself now collide with further pool members; the
 * process iterates until the plan stabilises or `maxCascadeDepth` is
 * exceeded. All work happens in a single `resolve()` call — the planner
 * is not re-invoked, so the result remains stateless.
 *
 * Versus STOP:
 * - STOP preserves the original layout outside the shift pool; remainder
 *   delta is lost when a candidate hits an obstacle.
 * - CHAIN_PUSH treats the obstacle as a domino and absorbs it into the
 *   shift, producing a tighter layout at the cost of touching more nodes.
 */
export class ChainPushCollisionResolver implements IFReflowCollisionResolver {
  constructor(private readonly _maxCascadeDepth: number) {}

  public resolve({
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
    const shifts = new Map<string, IChainPushEntry>();

    for (const raw of rawShifts) {
      const dx = this._clampAbs(raw.shift.x, maxAbsoluteShift);
      const dy = this._clampAbs(raw.shift.y, maxAbsoluteShift);
      if (dx === 0 && dy === 0) continue;
      shifts.set(raw.candidate.id, {
        candidate: raw.candidate,
        dx,
        dy,
        toRect: this._shifted(raw.candidate.rect, dx, dy),
      });
    }

    let depth = 0;
    let changed = true;
    while (changed && depth < this._maxCascadeDepth) {
      changed = false;
      depth++;

      for (const entry of [...shifts.values()]) {
        for (const candidate of pool) {
          if (shifts.has(candidate.id)) continue;
          const push = this._computePush(entry.toRect, candidate.rect, spacing);
          if (!push) continue;

          const dx = this._clampAbs(push.dx, maxAbsoluteShift);
          const dy = this._clampAbs(push.dy, maxAbsoluteShift);
          if (dx === 0 && dy === 0) continue;

          shifts.set(candidate.id, {
            candidate,
            dx,
            dy,
            toRect: this._shifted(candidate.rect, dx, dy),
          });
          changed = true;
        }
      }
    }

    const resolved: IReflowResolvedShift[] = [];
    for (const entry of shifts.values()) {
      resolved.push({
        candidate: entry.candidate,
        fromRect: entry.candidate.rect,
        toRect: entry.toRect,
        toPosition: { x: entry.toRect.x, y: entry.toRect.y },
      });
    }

    return resolved;
  }

  /**
   * If `mover` (already shifted) overlaps `target` (stationary) below
   * the configured per-axis spacing, return the displacement that would
   * restore that spacing. The push direction is determined by which
   * edge of the mover is impinging on the target.
   */
  private _computePush(
    mover: IRect,
    target: IRect,
    spacing: { vertical: number; horizontal: number },
  ): { dx: number; dy: number } | null {
    let dx = 0;
    let dy = 0;

    if (this._overlapsX(mover, target)) {
      const moverBottom = mover.y + mover.height;
      const targetBottom = target.y + target.height;
      if (moverBottom + spacing.vertical > target.y && mover.y < targetBottom) {
        if (mover.y < target.y) {
          // mover is above target → push target down
          dy = moverBottom + spacing.vertical - target.y;
        } else {
          // mover is below target → push target up
          dy = mover.y - targetBottom - spacing.vertical;
        }
      }
    }

    if (this._overlapsY(mover, target)) {
      const moverRight = mover.x + mover.width;
      const targetRight = target.x + target.width;
      if (moverRight + spacing.horizontal > target.x && mover.x < targetRight) {
        if (mover.x < target.x) {
          dx = moverRight + spacing.horizontal - target.x;
        } else {
          dx = mover.x - targetRight - spacing.horizontal;
        }
      }
    }

    if (dx === 0 && dy === 0) return null;

    return { dx, dy };
  }

  private _shifted(rect: IRect, dx: number, dy: number): IRect {
    return RectExtensions.initialize(rect.x + dx, rect.y + dy, rect.width, rect.height);
  }

  private _overlapsX(a: IRect, b: IRect): boolean {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }

  private _overlapsY(a: IRect, b: IRect): boolean {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }

  private _clampAbs(value: number, max: number): number {
    if (value > max) return max;
    if (value < -max) return -max;

    return value;
  }
}
