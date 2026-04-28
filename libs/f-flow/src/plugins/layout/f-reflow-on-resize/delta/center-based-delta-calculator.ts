import { IPoint, IRect } from '@foblex/2d';
import { EFReflowAxis } from '../enums';
import { IFReflowDeltaCalculator } from './i-f-reflow-delta-calculator';

/**
 * Roadmap-formula variant: shifts whole scalar delta based on center-line comparison.
 *
 * Vertical:
 *   deltaHeight = nextRect.height - baselineRect.height
 *   if deltaHeight !== 0 AND candidate.centerY > baseline.centerY → shift by deltaHeight
 *
 * This path has a known edge case under asymmetric resize (top-handle vs
 * bottom-handle), where a node's center moves by `deltaHeight/2` but the full
 * `deltaHeight` is applied to candidates — leading to mis-shifts when the top
 * edge is the one that actually moved. The edge-based calculator is preferred
 * for correctness; this implementation matches the formula as written in the
 * technical roadmap for users who opt in explicitly.
 */
export class CenterBasedDeltaCalculator implements IFReflowDeltaCalculator {
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
    const dy =
      axis === EFReflowAxis.VERTICAL || axis === EFReflowAxis.BOTH
        ? this._verticalShift(baselineRect, nextRect, candidateRect)
        : 0;

    const dx =
      axis === EFReflowAxis.HORIZONTAL || axis === EFReflowAxis.BOTH
        ? this._horizontalShift(baselineRect, nextRect, candidateRect)
        : 0;

    if (dx === 0 && dy === 0) {
      return null;
    }

    return { x: dx, y: dy };
  }

  private _verticalShift(baseline: IRect, next: IRect, candidate: IRect): number {
    const deltaHeight = next.height - baseline.height;

    if (deltaHeight === 0) {
      return 0;
    }

    const baselineCenterY = baseline.y + baseline.height / 2;
    const candidateCenterY = candidate.y + candidate.height / 2;

    if (deltaHeight > 0 && candidateCenterY > baselineCenterY) {
      return deltaHeight;
    }

    if (deltaHeight < 0 && candidateCenterY > baselineCenterY) {
      return deltaHeight;
    }

    return 0;
  }

  private _horizontalShift(baseline: IRect, next: IRect, candidate: IRect): number {
    const deltaWidth = next.width - baseline.width;

    if (deltaWidth === 0) {
      return 0;
    }

    const baselineCenterX = baseline.x + baseline.width / 2;
    const candidateCenterX = candidate.x + candidate.width / 2;

    if (deltaWidth > 0 && candidateCenterX > baselineCenterX) {
      return deltaWidth;
    }

    if (deltaWidth < 0 && candidateCenterX > baselineCenterX) {
      return deltaWidth;
    }

    return 0;
  }
}
