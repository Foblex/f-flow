import { IPoint } from '@foblex/2d';
import {
  buildCurveCandidates,
  calculateUserAnchorPoints,
  createMultiCubicPath,
  ICubicSegment,
  sampleMultiCubicUniform,
} from '../utils';
import {
  IFConnectionBuilderResponse,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
} from '../../models';
import { EFConnectableSide } from '../../../../enums';

export class CalculateAdaptiveCurveData implements IFConnectionBuilder {
  private static _dir(side: EFConnectableSide): IPoint {
    switch (side) {
      case EFConnectableSide.LEFT:
        return { x: -1, y: 0 };
      case EFConnectableSide.RIGHT:
        return { x: 1, y: 0 };
      case EFConnectableSide.TOP:
        return { x: 0, y: -1 };
      case EFConnectableSide.BOTTOM:
        return { x: 0, y: 1 };
      case EFConnectableSide.AUTO:
        return { x: 0, y: 0 };
    }

    return { x: 0, y: 0 };
  }

  private static _isHorizontal(side: EFConnectableSide): boolean {
    return side === EFConnectableSide.LEFT || side === EFConnectableSide.RIGHT;
  }

  private static _handleLength(
    p0: IPoint,
    p3: IPoint,
    side: EFConnectableSide,
    offset: number,
  ): number {
    const dx = Math.abs(p3.x - p0.x);
    const dy = Math.abs(p3.y - p0.y);
    const d = Math.hypot(dx, dy);

    // AUTO для внутренних цепочек: пусть растёт по max(dx,dy)
    const along =
      side === EFConnectableSide.AUTO ? Math.max(dx, dy) : this._isHorizontal(side) ? dx : dy;

    const MIN = Math.max(8, offset);
    const MAX = offset + 0.5 * d;
    const len = offset * 1.05 + along * 0.3;

    return Math.min(MAX, Math.max(MIN, len));
  }

  private static _softControl(
    side: EFConnectableSide,
    source: IPoint,
    target: IPoint,
    handle: number,
  ): IPoint {
    const v = this._dir(side);

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.hypot(dx, dy) || 1;
    const tx = dx / dist;
    const ty = dy / dist;

    // AUTO: просто "в сторону цели" (внутренние сегменты должны быть мягкими)
    if (side === EFConnectableSide.AUTO) {
      return { x: source.x + tx * handle, y: source.y + ty * handle };
    }

    const dot = v.x * tx + v.y * ty;

    const baseBlend = 0.12;
    const extra = Math.max(0, -dot) * 0.08;
    const blend = Math.min(0.2, baseBlend + extra);

    const dirX = v.x * (1 - blend) + tx * blend;
    const dirY = v.y * (1 - blend) + ty * blend;
    const len = Math.hypot(dirX, dirY) || 1;

    return { x: source.x + (dirX / len) * handle, y: source.y + (dirY / len) * handle };
  }

  public handle(req: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, sourceSide, target, targetSide, offset, pivots } = req;
    const clampedOffset = Math.max(0, offset ?? 0);

    const anchors = [source, ...calculateUserAnchorPoints(pivots), target];

    const segments: ICubicSegment[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const isFirst = i === 0;
      const isLast = i === anchors.length - 2;

      const aSide = isFirst ? sourceSide : EFConnectableSide.AUTO;
      const bSide = isLast ? targetSide : EFConnectableSide.AUTO;

      const h0 = CalculateAdaptiveCurveData._handleLength(a, b, aSide, clampedOffset);
      const h3 = CalculateAdaptiveCurveData._handleLength(b, a, bSide, clampedOffset);

      const c1 = CalculateAdaptiveCurveData._softControl(aSide, a, b, h0);
      const c2 = CalculateAdaptiveCurveData._softControl(bSide, b, a, h3);

      segments.push({ p0: a, c1, c2, p3: b, chainIndex: i });
    }

    const points = sampleMultiCubicUniform(segments, 12);
    const candidates = buildCurveCandidates(segments);

    return {
      path: createMultiCubicPath(segments),
      secondPoint: segments[0]?.c1 ?? source,
      penultimatePoint: segments[segments.length - 1]?.c2 ?? target,
      points,
      candidates,
    };
  }
}

// import { IPoint } from '@foblex/2d';
// import { calculateUserAnchorPoints, sampleCubicBezierUniform } from '../utils';
// import {
//   IFConnectionBuilderResponse,
//   IFConnectionBuilder,
//   IFConnectionBuilderRequest,
// } from '../../models';
// import { EFConnectableSide } from '../../../../enums';
// import { createAdaptiveCurvePath } from './create-adaptive-curve-path';
//
// /**
//  * CalculateAdaptiveCurveData
//  *
//  * Builds a smooth **adaptive connector curve** between two points using a cubic Bézier path,
//  * but with control points computed differently from a classic “Bezier” connector.
//  *
//  * Key differences from a classic Bézier builder:
//  * - Control handles are **aligned with the port side** (LEFT/RIGHT/TOP/BOTTOM),
//  *   yet are **slightly blended toward the target direction** to reduce harsh S-shapes.
//  * - Handle lengths are **adaptive**: based on the `offset` (your “padding” from ports)
//  *   and the projected distance along the side’s axis. This produces a subtler curvature
//  *   and a distinct look & feel compared to a standard Bézier connector.
//  *
//  * Compatibility:
//  * - Implements {@link IFConnectionBuilder}; output shape is the same:
//  *   SVG path, sampled points for hit-testing, and connection center.
//  * - Only the four base sides are expected to be passed here:
//  *   {@link EFConnectableSide.LEFT}, {@link EFConnectableSide.RIGHT},
//  *   {@link EFConnectableSide.TOP}, {@link EFConnectableSide.BOTTOM}.
//  *
//  * Usage example:
//  * ```ts
//  * const builder = new CalculateAdaptiveCurveData();
//  * const res = builder.handle({
//  *   source: { x: 100, y: 120 },
//  *   sourceSide: EFConnectableSide.RIGHT,
//  *   target: { x: 340, y: 220 },
//  *   targetSide: EFConnectableSide.LEFT,
//  *   offset: 16, // acts as padding + minimal handle baseline
//  * });
//  * // res.path -> SVG "M … C …" string
//  * // res.points -> sampled points along the curve
//  * ```
//  */
// export class CalculateAdaptiveCurveData implements IFConnectionBuilder {
//   /**
//    * Returns a unit direction vector for a given side.
//    *
//    * @param side - One of LEFT/RIGHT/TOP/BOTTOM.
//    * @returns Unit vector pointing outwards from the side.
//    * @remarks
//    * Only base sides should reach this builder. A fallback `{0,0}` is returned
//    * defensively, but should not occur in normal usage.
//    */
//   private static _dir(side: EFConnectableSide): IPoint {
//     switch (side) {
//       case EFConnectableSide.LEFT:
//         return { x: -1, y: 0 };
//       case EFConnectableSide.RIGHT:
//         return { x: 1, y: 0 };
//       case EFConnectableSide.TOP:
//         return { x: 0, y: -1 };
//       case EFConnectableSide.BOTTOM:
//         return { x: 0, y: 1 };
//     }
//
//     return { x: 0, y: 0 };
//   }
//
//   /**
//    * Checks whether a side is horizontal (LEFT/RIGHT).
//    *
//    * @param side - Side to check.
//    * @returns `true` for LEFT/RIGHT, otherwise `false`.
//    */
//   private static _isHorizontal(side: EFConnectableSide): boolean {
//     return side === EFConnectableSide.LEFT || side === EFConnectableSide.RIGHT;
//   }
//
//   /**
//    * Computes a **soft** handle length for a control point.
//    *
//    * The handle length is derived from:
//    * - `offset` (acts as padding & the baseline handle),
//    * - distance projected along the side’s axis (dx for horizontal, dy for vertical),
//    * - a conservative upper bound to avoid bloated curves.
//    *
//    * @param p0 - Start (or end) point of the segment.
//    * @param p3 - Opposite end (or start) point.
//    * @param side - Side at which the handle originates.
//    * @param offset - Visual padding/minimal handle baseline (must be ≥ 0).
//    * @returns A bounded positive handle length.
//    */
//   private static _handleLength(
//     p0: IPoint,
//     p3: IPoint,
//     side: EFConnectableSide,
//     offset: number,
//   ): number {
//     const dx = Math.abs(p3.x - p0.x);
//     const dy = Math.abs(p3.y - p0.y);
//     const d = Math.hypot(dx, dy);
//     const along = this._isHorizontal(side) ? dx : dy;
//
//     const MIN = Math.max(8, offset);
//     const MAX = offset + 0.5 * d; // upper cap to keep the shape compact
//     const len = offset * 1.05 + along * 0.3; // moderate growth along the axis
//
//     return Math.min(MAX, Math.max(MIN, len));
//   }
//
//   /**
//    * Computes a control point by taking the side direction and **lightly blending**
//    * it toward the target direction. This reduces harsh inflections while keeping
//    * the perceptual attachment to the port side.
//    *
//    * @param side - Base side defining the primary direction (LEFT/RIGHT/TOP/BOTTOM).
//    * @param source - Anchor point where the control handle is attached.
//    * @param target - Opposite end; used to orient the handle slightly toward the goal.
//    * @param handle - Handle length (see {@link _handleLength}).
//    * @returns Control point coordinates for the cubic Bézier segment.
//    */
//   private static _softControl(
//     side: EFConnectableSide,
//     source: IPoint,
//     target: IPoint,
//     handle: number,
//   ): IPoint {
//     const v = this._dir(side);
//
//     const dx = target.x - source.x;
//     const dy = target.y - source.y;
//     const dist = Math.hypot(dx, dy) || 1;
//     const tx = dx / dist;
//     const ty = dy / dist;
//
//     // Orientation of side vs. target direction (in [-1, 1])
//     const dot = v.x * tx + v.y * ty;
//
//     // Small base blend toward the target; slightly increase if the side points away.
//     const baseBlend = 0.12;
//     const extra = Math.max(0, -dot) * 0.08; // add a bit when pointing “backwards”
//     const blend = Math.min(0.2, baseBlend + extra);
//
//     const dirX = v.x * (1 - blend) + tx * blend;
//     const dirY = v.y * (1 - blend) + ty * blend;
//     const len = Math.hypot(dirX, dirY) || 1;
//
//     return { x: source.x + (dirX / len) * handle, y: source.y + (dirY / len) * handle };
//   }
//
//   /**
//    * Builds an adaptive connector between `source` and `target`.
//    *
//    * @param request - Connection build request.
//    * @param request.source - Start point of the connector.
//    * @param request.sourceSide - Side at the source port (LEFT/RIGHT/TOP/BOTTOM).
//    * @param request.target - End point of the connector.
//    * @param request.targetSide - Side at the target port (LEFT/RIGHT/TOP/BOTTOM).
//    * @param request.offset - Visual padding & minimal handle baseline (≥ 0).
//    *
//    * @returns Standard {@link IFConnectionBuilderResponse}:
//    * - `path`: SVG cubic path (“M … C …”),
//    * - `points`: discretized samples along the curve,
//    * - `connectionCenter`: approximate visual center for labeling/interaction,
//    * - `secondPoint`/`penultimatePoint`: first/second control points (for tooling).
//    *
//    * @remarks
//    * The returned path slightly offsets the end point by +0.0002 on both axes
//    * to avoid edge cases in some renderers and hit-testing implementations.
//    */
//   public handle({
//                   source,
//                   sourceSide,
//                   target,
//                   targetSide,
//                   offset,
//                   pivots,
//                 }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
//     const clampedOffset = Math.max(0, offset ?? 0);
//
//     const p0 = { x: source.x, y: source.y };
//     const p3 = { x: target.x, y: target.y };
//
//     const h0 = CalculateAdaptiveCurveData._handleLength(p0, p3, sourceSide, clampedOffset);
//     const h3 = CalculateAdaptiveCurveData._handleLength(p3, p0, targetSide, clampedOffset);
//
//     const c1 = CalculateAdaptiveCurveData._softControl(sourceSide, p0, p3, h0);
//     const c2 = CalculateAdaptiveCurveData._softControl(targetSide, p3, p0, h3);
//     const anchors = calculateUserAnchorPoints(pivots);
//
//     const points = [p0, c1, ...anchors, c2, p3];
//
//     return {
//       path: createAdaptiveCurvePath(points),
//       secondPoint: c1,
//       penultimatePoint: c2,
//       points: sampleCubicBezierUniform(points, 5),
//     };
//   }
// }
