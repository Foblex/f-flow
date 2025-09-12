import { Injectable } from '@angular/core';
import { ApplyParentResizeConstraintsRequest } from './apply-parent-resize-constraints-request';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IResizeLimit, IResizeLimits, IResizeOverflow } from '../constraint';

/**
 * Resize constraints behavior:
 * - SOFT (parents): if the child hits the innerRect, a NEW parent rect is calculated
 *   from the original boundingRect and applied via updatePosition/Size/redraw.
 *   The original boundingRect/innerRect are never mutated.
 * - HARD (child): the child rect is clamped to stay within the hard.innerRect.
 */
@Injectable()
@FExecutionRegister(ApplyParentResizeConstraintsRequest)
export class ApplyParentResizeConstraints
  implements IExecution<ApplyParentResizeConstraintsRequest, void>
{
  /** Entry point: applies soft and hard resize constraints. */
  public handle({ rect, limits }: ApplyParentResizeConstraintsRequest): void {
    this._applyResizeConstraints(rect, limits);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Top–level orchestration
  // ──────────────────────────────────────────────────────────────────────────────

  private _applyResizeConstraints(childRect: IRect, limits: IResizeLimits): void {
    if (!limits) {
      return;
    }

    // 1) Clone child rect and pre-clamp it by hard limit (calculation only).
    const childForCalc: IRect = this._clampedCopyForCalculation(childRect, limits);

    // 2) Apply SOFT expansions for all parent limits based on the clamped child.
    this._applySoftParentExpansions(childForCalc, limits.softLimits);

    // 3) Final HARD clamp on the real child rect.
    if (limits.hardLimit) {
      this._clampRectToInner(childRect, limits.hardLimit.innerRect);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Hard-limit stage
  // ──────────────────────────────────────────────────────────────────────────────

  /** Returns a copy of the child rect pre-clamped to the hard innerRect if it exists. */
  private _clampedCopyForCalculation(rect: IRect, limits: IResizeLimits): IRect {
    const copy: IRect = { ...rect };
    if (limits.hardLimit) {
      this._clampRectToInner(copy, limits.hardLimit.innerRect);
    }

    return copy;
  }

  /** Clamps the rect inside the given innerRect. Mutates the rect directly. */
  private _clampRectToInner(rect: IRect, inner: IRect): void {
    // Left
    if (rect.x < inner.x) {
      const diff = inner.x - rect.x;
      rect.x += diff;
      rect.width -= diff;
    }

    // Top
    if (rect.y < inner.y) {
      const diff = inner.y - rect.y;
      rect.y += diff;
      rect.height -= diff;
    }

    // Right
    const rightMax = inner.x + inner.width;
    if (rect.x + rect.width > rightMax) {
      rect.width = rightMax - rect.x;
    }

    // Bottom
    const bottomMax = inner.y + inner.height;
    if (rect.y + rect.height > bottomMax) {
      rect.height = bottomMax - rect.y;
    }

    // Ensure non-negative sizes
    rect.width = Math.max(0, rect.width);
    rect.height = Math.max(0, rect.height);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Soft-limit stage
  // ──────────────────────────────────────────────────────────────────────────────

  /** Iterates over all soft limits and applies expansion if overflow is detected. */
  private _applySoftParentExpansions(childForCalc: IRect, softLimits: IResizeLimit[]): void {
    if (!softLimits?.length) {
      return;
    }
    for (const limit of softLimits) {
      this._expandParentFromOriginalIfOverflow(childForCalc, limit);
    }
  }

  /**
   * If the child overflows the parent's innerRect, calculate a new parent rect
   * based on the original boundingRect and apply it. Otherwise, reset to original.
   */
  private _expandParentFromOriginalIfOverflow(child: IRect, limit: IResizeLimit): void {
    const inner = limit.innerRect; // detector only
    const original = limit.boundingRect; // parent's original rect

    const overflow = this._computeOverflow(inner, child);

    if (!this._hasOverflow(overflow)) {
      this._applyParentRect(limit, original);

      return;
    }

    const nextParent = this._buildExpandedParentRect(original, overflow);
    this._applyParentRect(limit, nextParent);
  }

  /** Returns true if any overflow exists. */
  private _hasOverflow(o: IResizeOverflow): boolean {
    return !!(o.left || o.top || o.right || o.bottom);
  }

  /** Computes overflow values for each side relative to innerRect. */
  private _computeOverflow(inner: IRect, child: IRect): IResizeOverflow {
    const left = Math.max(0, inner.x - child.x);
    const top = Math.max(0, inner.y - child.y);
    const right = Math.max(0, child.x + child.width - (inner.x + inner.width));
    const bottom = Math.max(0, child.y + child.height - (inner.y + inner.height));

    return { left, top, right, bottom };
  }

  /** Builds new parent rect from original rect and overflow values. */
  private _buildExpandedParentRect(original: IRect, o: IResizeOverflow): IRect {
    const parent: IRect = { ...original };

    if (o.left) {
      parent.x = original.x - o.left;
      parent.width = original.width + o.left;
    }
    if (o.top) {
      parent.y = original.y - o.top;
      parent.height = original.height + o.top;
    }
    if (o.right) {
      parent.width = (parent.width ?? original.width) + o.right;
    }
    if (o.bottom) {
      parent.height = (parent.height ?? original.height) + o.bottom;
    }

    return parent;
  }

  /** Applies the calculated parent rect to the node/group. */
  private _applyParentRect(limit: IResizeLimit, rect: IRect): void {
    limit.nodeOrGroup.updatePosition(rect);
    limit.nodeOrGroup.updateSize(rect);
    limit.nodeOrGroup.redraw();
  }
}
