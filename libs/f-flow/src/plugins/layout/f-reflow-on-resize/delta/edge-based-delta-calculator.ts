import { IPoint, IRect } from '@foblex/2d';
import { EFReflowAxis } from '../enums';
import {
  computeEdgeDeltas,
  IFReflowDeltaCalculator,
  IResizeEdgeDeltas,
} from './i-f-reflow-delta-calculator';

/**
 * Computes shift vectors based on which edges of the resized node moved and
 * whether the candidate lies beyond that edge in the pre-resize layout.
 *
 * Rules (vertical axis):
 * - `deltaEdges.bottom > 0` (bottom grew outward) and `candidate.top >= baseline.bottom`
 *   → candidate shifts down by `deltaEdges.bottom`.
 * - `deltaEdges.bottom < 0` (bottom collapsed upward) and `candidate.top >= nextBottom`
 *   → candidate shifts up by `deltaEdges.bottom`.
 * - `deltaEdges.top > 0` (top grew outward, i.e. node expanded upward) and
 *   `candidate.bottom <= baseline.top` → candidate shifts up by `-deltaEdges.top`.
 * - `deltaEdges.top < 0` (top collapsed downward) and `candidate.bottom <= nextTop`
 *   → candidate shifts down by `-deltaEdges.top`.
 *
 * Horizontal axis is symmetric (swap top/bottom with left/right).
 */
export class EdgeBasedDeltaCalculator implements IFReflowDeltaCalculator {
  public calculate({
    baselineRect,
    nextRect,
    candidateRect,
    axis,
  }: {
    baselineRect: IRect;
    nextRect: IRect;
    candidateRect: IRect;
    axis: EFReflowAxis;
  }): IPoint | null {
    const deltas = computeEdgeDeltas(baselineRect, nextRect);

    const dy =
      axis === EFReflowAxis.VERTICAL || axis === EFReflowAxis.BOTH
        ? this._verticalShift(deltas, baselineRect, nextRect, candidateRect)
        : 0;

    const dx =
      axis === EFReflowAxis.HORIZONTAL || axis === EFReflowAxis.BOTH
        ? this._horizontalShift(deltas, baselineRect, nextRect, candidateRect)
        : 0;

    if (dx === 0 && dy === 0) {
      return null;
    }

    return { x: dx, y: dy };
  }

  private _verticalShift(
    deltas: IResizeEdgeDeltas,
    baseline: IRect,
    next: IRect,
    candidate: IRect,
  ): number {
    const baselineBottom = baseline.y + baseline.height;
    const baselineTop = baseline.y;
    const nextBottom = next.y + next.height;
    const nextTop = next.y;
    const candidateTop = candidate.y;
    const candidateBottom = candidate.y + candidate.height;

    if (deltas.bottom > 0 && candidateTop >= baselineBottom) {
      return deltas.bottom;
    }

    if (deltas.bottom < 0 && candidateTop >= nextBottom) {
      return deltas.bottom;
    }

    if (deltas.top > 0 && candidateBottom <= baselineTop) {
      return -deltas.top;
    }

    if (deltas.top < 0 && candidateBottom <= nextTop) {
      return -deltas.top;
    }

    return 0;
  }

  private _horizontalShift(
    deltas: IResizeEdgeDeltas,
    baseline: IRect,
    next: IRect,
    candidate: IRect,
  ): number {
    const baselineRight = baseline.x + baseline.width;
    const baselineLeft = baseline.x;
    const nextRight = next.x + next.width;
    const nextLeft = next.x;
    const candidateLeft = candidate.x;
    const candidateRight = candidate.x + candidate.width;

    if (deltas.right > 0 && candidateLeft >= baselineRight) {
      return deltas.right;
    }

    if (deltas.right < 0 && candidateLeft >= nextRight) {
      return deltas.right;
    }

    if (deltas.left > 0 && candidateRight <= baselineLeft) {
      return -deltas.left;
    }

    if (deltas.left < 0 && candidateRight <= nextLeft) {
      return -deltas.left;
    }

    return 0;
  }
}
