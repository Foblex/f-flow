import { IPoint, IRect } from '@foblex/2d';
import { EFReflowAxis } from '../enums';

/**
 * Per-edge deltas produced by a resize.
 *
 * All values are signed:
 * - positive `top` or `left` = the edge moved outward (grow from that side)
 * - positive `bottom` or `right` = the edge moved outward in the same direction
 * - the sum along an axis equals the total size change on that axis.
 */
export interface IResizeEdgeDeltas {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function computeEdgeDeltas(baseline: IRect, next: IRect): IResizeEdgeDeltas {
  return {
    top: baseline.y - next.y,
    right: next.x + next.width - (baseline.x + baseline.width),
    bottom: next.y + next.height - (baseline.y + baseline.height),
    left: baseline.x - next.x,
  };
}

/**
 * Computes the raw shift vector a candidate should receive for a single resize
 * event, before collision/scope adjustments.
 *
 * Returns `null` when the candidate is not affected on the active axis.
 */
export interface IFReflowDeltaCalculator {
  calculate(input: {
    baselineRect: IRect;
    nextRect: IRect;
    candidateRect: IRect;
    axis: EFReflowAxis;
  }): IPoint | null;
}
