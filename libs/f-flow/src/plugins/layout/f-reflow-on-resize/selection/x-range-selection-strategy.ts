import { IRect } from '@foblex/2d';
import { EFReflowAxis } from '../enums';
import { IFReflowSelectionStrategy, IReflowCandidate } from './i-f-reflow-selection-strategy';

/**
 * Restricts the candidate pool to nodes that overlap the resizing source
 * on the *perpendicular* axis:
 *
 * - Vertical resize → keep candidates whose horizontal span intersects
 *   the source (`[M.left, M.right] ∩ [N.left, N.right] ≠ ∅`).
 * - Horizontal resize → keep candidates whose vertical span intersects
 *   the source.
 * - Combined (`BOTH`) → keep candidates that overlap on either axis.
 *
 * Compared to `CENTER_OF_MASS`, this localises the reflow to the same
 * visual column / row as the source — useful for column-style workflows
 * where global shifts are too aggressive.
 */
export class XRangeSelectionStrategy implements IFReflowSelectionStrategy {
  public select({
    sourceId,
    sourceBaselineRect,
    sourceNextRect,
    candidates,
    axis,
  }: {
    sourceId: string;
    sourceBaselineRect: IRect;
    sourceNextRect: IRect;
    candidates: IReflowCandidate[];
    axis: EFReflowAxis;
  }): IReflowCandidate[] {
    return candidates.filter((c) => {
      if (c.id === sourceId) return false;

      switch (axis) {
        case EFReflowAxis.VERTICAL:
          return (
            this._overlapsX(c.rect, sourceBaselineRect) || this._overlapsX(c.rect, sourceNextRect)
          );
        case EFReflowAxis.HORIZONTAL:
          return (
            this._overlapsY(c.rect, sourceBaselineRect) || this._overlapsY(c.rect, sourceNextRect)
          );
        case EFReflowAxis.BOTH:
        default:
          return (
            this._overlapsX(c.rect, sourceBaselineRect) ||
            this._overlapsX(c.rect, sourceNextRect) ||
            this._overlapsY(c.rect, sourceBaselineRect) ||
            this._overlapsY(c.rect, sourceNextRect)
          );
      }
    });
  }

  private _overlapsX(a: IRect, b: IRect): boolean {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }

  private _overlapsY(a: IRect, b: IRect): boolean {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }
}
