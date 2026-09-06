import { IPoint } from '@foblex/2d';
import {
  buildConnectionAnchors,
  calculateCurveCandidates,
  calculateSmoothControlPoint,
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

export class CalculateBezierCurveData implements IFConnectionBuilder {
  public handle({
    source,
    sourceSide,
    target,
    targetSide,
    offset,
    waypoints,
  }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = buildConnectionAnchors(source, target, waypoints);

    const segments: ICubicSegment[] = [];

    // Connector sides shape only the first and the last tangent; at
    // intermediate waypoints both adjacent segments share one Catmull-Rom
    // style tangent, so the curve passes through waypoints without kinks.
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const handle = Math.hypot(b.x - a.x, b.y - a.y) / 3;

      const c1 =
        i === 0
          ? getAnglePoint(sourceSide, a, b, offset ?? 0)
          : calculateSmoothControlPoint(a, anchors[i - 1], b, handle);

      const c2 =
        i === anchors.length - 2
          ? getAnglePoint(targetSide, b, a, offset ?? 0)
          : calculateSmoothControlPoint(b, a, anchors[i + 2], -handle);

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

function getAnglePoint(
  side: EFConnectableSide,
  source: IPoint,
  target: IPoint,
  offset: number,
): IPoint {
  const result: IPoint = { x: source.x, y: source.y };

  switch (side) {
    case EFConnectableSide.LEFT:
      result.x -= getConnectorOffset(source.x - target.x, offset);
      break;
    case EFConnectableSide.RIGHT:
      result.x += getConnectorOffset(target.x - source.x, offset);
      break;
    case EFConnectableSide.TOP:
      result.y -= getConnectorOffset(source.y - target.y, offset);
      break;
    case EFConnectableSide.BOTTOM:
      result.y += getConnectorOffset(target.y - source.y, offset);
      break;
    case EFConnectableSide.AUTO:
      break;
  }

  return result;
}

function getConnectorOffset(distance: number, offset: number): number {
  if (distance >= offset) return distance;

  return offset * Math.sqrt(offset - distance);
}
