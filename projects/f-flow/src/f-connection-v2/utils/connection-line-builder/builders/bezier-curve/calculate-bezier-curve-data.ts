import { IPoint } from '@foblex/2d';
import {
  buildConnectionAnchors,
  buildCurveCandidates,
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

export class CalculateBezierCurveData implements IFConnectionBuilder {
  public handle({
    source,
    sourceSide,
    target,
    targetSide,
    offset,
    pivots,
  }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = buildConnectionAnchors(source, target, pivots);

    const segments: ICubicSegment[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const isFirst = i === 0;
      const isLast = i === anchors.length - 2;

      const c1 = isFirst
        ? getAnglePoint(sourceSide, a, b, offset ?? 0)
        : controlAlongLine(a, b, 0.33);

      const c2 = isLast
        ? getAnglePoint(targetSide, b, a, offset ?? 0)
        : controlAlongLine(b, a, 0.33);

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

function controlAlongLine(from: IPoint, to: IPoint, k: number): IPoint {
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
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

//
// import { IPoint } from '@foblex/2d';
// import { calculateUserAnchorPoints, sampleCubicBezierUniform } from '../utils';
// import { createBezierCurvePath } from './create-bezier-curve-path';
// import {
//   IFConnectionBuilderResponse,
//   IFConnectionBuilder,
//   IFConnectionBuilderRequest,
// } from '../../models';
// import { EFConnectableSide } from '../../../../enums';
//
// export class CalculateBezierCurveData implements IFConnectionBuilder {
//   public handle({
//                   source,
//                   sourceSide,
//                   target,
//                   targetSide,
//                   offset,
//                   pivots,
//                 }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
//     const sourceAnglePoint = getAnglePoint(sourceSide, source, target, offset);
//
//     const targetAnglePoint = getAnglePoint(targetSide, target, source, offset);
//     const anchors = calculateUserAnchorPoints(pivots);
//
//     const points = [source, sourceAnglePoint, ...anchors, targetAnglePoint, target];
//
//     return {
//       path: createBezierCurvePath(points),
//       penultimatePoint: targetAnglePoint,
//       secondPoint: sourceAnglePoint,
//       points: sampleCubicBezierUniform(points, 5),
//     };
//   }
// }
//
// function getAnglePoint(
//   side: EFConnectableSide,
//   source: IPoint,
//   target: IPoint,
//   offset: number,
// ): IPoint {
//   const result: IPoint = { x: source.x, y: source.y };
//
//   switch (side) {
//     case EFConnectableSide.LEFT:
//       result.x -= getConnectorOffset(source.x - target.x, offset);
//       break;
//     case EFConnectableSide.RIGHT:
//       result.x += getConnectorOffset(target.x - source.x, offset);
//       break;
//     case EFConnectableSide.TOP:
//       result.y -= getConnectorOffset(source.y - target.y, offset);
//       break;
//     case EFConnectableSide.BOTTOM:
//       result.y += getConnectorOffset(target.y - source.y, offset);
//       break;
//   }
//
//   return result;
// }
//
// function getConnectorOffset(distance: number, offset: number): number {
//   if (distance >= offset) {
//     return distance;
//   }
//
//   return offset * Math.sqrt(offset - distance);
// }
