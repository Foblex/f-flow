import { IPoint } from '@foblex/2d';
import {
  buildConnectionAnchors,
  calculateCurveCandidates,
  createMultiCubicPath,
  ICubicSegment,
  sampleMultiCubicUniform,
} from '../utils';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
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

  public handle({
    source,
    sourceSide,
    target,
    targetSide,
    offset,
    waypoints,
  }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const clampedOffset = Math.max(0, offset ?? 0);

    const anchors = buildConnectionAnchors(source, target, waypoints);

    const segments: ICubicSegment[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const h0 = CalculateAdaptiveCurveData._handleLength(a, b, sourceSide, clampedOffset);
      const h3 = CalculateAdaptiveCurveData._handleLength(b, a, targetSide, clampedOffset);

      const c1 = CalculateAdaptiveCurveData._softControl(sourceSide, a, b, h0);
      const c2 = CalculateAdaptiveCurveData._softControl(targetSide, b, a, h3);

      segments.push({ p0: a, c1, c2, p3: b, chainIndex: i });
    }

    const points = sampleMultiCubicUniform(segments, 12);

    return {
      path: createMultiCubicPath(segments),
      secondPoint: segments[0]?.c1 ?? source,
      penultimatePoint: segments[segments.length - 1]?.c2 ?? target,
      points,
      candidates: calculateCurveCandidates(segments),
    };
  }
}
