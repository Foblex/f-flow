import { IPoint, PointExtensions } from '@foblex/2d';
import { IMap } from '../../../../../domain';
import {
  buildPolylineCandidatesForChain,
  calculateCenterBetweenPoints,
  calculateUserAnchorPoints,
  mergePointChains,
} from '../utils';
import { createSegmentLinePath } from './create-segment-line-path';
import {
  IFConnectionBuilderResponse,
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
} from '../../models';
import { EFConnectableSide } from '../../../../enums';
import { IControlPointCandidate } from '../../../../components';

const CONNECTOR_SIDE_POINT: IMap<IPoint> = {
  [EFConnectableSide.LEFT]: PointExtensions.initialize(-1, 0),

  [EFConnectableSide.RIGHT]: PointExtensions.initialize(1, 0),

  [EFConnectableSide.TOP]: PointExtensions.initialize(0, -1),

  [EFConnectableSide.BOTTOM]: PointExtensions.initialize(0, 1),

  [EFConnectableSide.AUTO]: PointExtensions.initialize(0, 0),
};

function inferSide(from: IPoint, to: IPoint): EFConnectableSide {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? EFConnectableSide.RIGHT : EFConnectableSide.LEFT;
  }

  return dy >= 0 ? EFConnectableSide.BOTTOM : EFConnectableSide.TOP;
}

function buildSingleBendPolyline(a: IPoint, b: IPoint): IPoint[] {
  if (a.x === b.x || a.y === b.y) {
    return [a, b];
  }

  return [a, { x: a.x, y: b.y }, b];
}

export class CalculateSegmentLineData implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, sourceSide, target, targetSide, pivots, offset, radius } = request;

    const anchors = [source, ...calculateUserAnchorPoints(pivots), target];

    const chains: IPoint[][] = [];
    const candidates: IControlPointCandidate[] = [];

    const lastSeg = anchors.length - 2;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const isFirst = i === 0;
      const isLast = i === lastSeg;

      let chainPolyline: IPoint[];

      if (!isFirst && !isLast) {
        chainPolyline = buildSingleBendPolyline(a, b);
      } else {
        const aSide = isFirst ? sourceSide : inferSide(a, b);
        const bSide = isLast ? targetSide : inferSide(b, a);

        const { points } = this._getPathPoints(a, aSide, b, bSide, offset ?? 0);
        chainPolyline = points;
      }

      chains.push(chainPolyline);
      candidates.push(...buildPolylineCandidatesForChain(chainPolyline, i));
    }

    const polyline = mergePointChains(chains);

    const penultimatePoint = polyline.length > 1 ? polyline[polyline.length - 2] : source;
    const secondPoint = polyline.length > 1 ? polyline[1] : target;

    return {
      path: createSegmentLinePath(polyline, radius ?? 0),
      penultimatePoint,
      secondPoint,
      points: polyline,
      candidates,
    };
  }

  private _getPathPoints(
    source: IPoint,
    sourceSide: EFConnectableSide,
    target: IPoint,
    targetSide: EFConnectableSide,
    offset: number,
  ): { points: IPoint[] } {
    const sourceDirection = CONNECTOR_SIDE_POINT[sourceSide];
    const targetDirection = CONNECTOR_SIDE_POINT[targetSide];

    const sourceGap: IPoint = {
      x: source.x + sourceDirection.x * offset,
      y: source.y + sourceDirection.y * offset,
    };
    const targetGap: IPoint = {
      x: target.x + targetDirection.x * offset,
      y: target.y + targetDirection.y * offset,
    };

    const direction = this._getDirection(sourceGap, sourceSide, targetGap);
    const directionAccessor = direction.x !== 0 ? 'x' : 'y';
    const currentDirection = direction[directionAccessor];

    let points: IPoint[] = [];
    const sourceGapOffset = PointExtensions.initialize();
    const targetGapOffset = PointExtensions.initialize();

    const centerBetweenPoints = calculateCenterBetweenPoints(source, target);

    if (sourceDirection[directionAccessor] * targetDirection[directionAccessor] === -1) {
      const verticalSplit: IPoint[] = [
        { x: centerBetweenPoints.x, y: sourceGap.y },
        { x: centerBetweenPoints.x, y: targetGap.y },
      ];
      const horizontalSplit: IPoint[] = [
        { x: sourceGap.x, y: centerBetweenPoints.y },
        { x: targetGap.x, y: centerBetweenPoints.y },
      ];

      if (sourceDirection[directionAccessor] === currentDirection) {
        points = directionAccessor === 'x' ? verticalSplit : horizontalSplit;
      } else {
        points = directionAccessor === 'x' ? horizontalSplit : verticalSplit;
      }
    } else {
      const sourceTarget: IPoint[] = [{ x: sourceGap.x, y: targetGap.y }];
      const targetSource: IPoint[] = [{ x: targetGap.x, y: sourceGap.y }];

      if (directionAccessor === 'x') {
        points = sourceDirection.x === currentDirection ? targetSource : sourceTarget;
      } else {
        points = sourceDirection.y === currentDirection ? sourceTarget : targetSource;
      }

      if (sourceSide === targetSide) {
        const diff = Math.abs(source[directionAccessor] - target[directionAccessor]);

        if (diff <= offset) {
          const gapOffset = Math.min(offset - 1, offset - diff);
          if (sourceDirection[directionAccessor] === currentDirection) {
            sourceGapOffset[directionAccessor] =
              (sourceGap[directionAccessor] > source[directionAccessor] ? -1 : 1) * gapOffset;
          } else {
            targetGapOffset[directionAccessor] =
              (targetGap[directionAccessor] > target[directionAccessor] ? -1 : 1) * gapOffset;
          }
        }
      }

      if (sourceSide !== targetSide) {
        const dirAccessorOpposite = directionAccessor === 'x' ? 'y' : 'x';
        const isSameDir =
          sourceDirection[directionAccessor] === targetDirection[dirAccessorOpposite];
        const sourceGtTargetOppo = sourceGap[dirAccessorOpposite] > targetGap[dirAccessorOpposite];
        const sourceLtTargetOppo = sourceGap[dirAccessorOpposite] < targetGap[dirAccessorOpposite];
        const flipSourceTarget =
          (sourceDirection[directionAccessor] === 1 &&
            ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
          (sourceDirection[directionAccessor] !== 1 &&
            ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));

        if (flipSourceTarget) {
          points = directionAccessor === 'x' ? sourceTarget : targetSource;
        }
      }
    }

    const pathPoints = [
      source,
      { x: sourceGap.x + sourceGapOffset.x, y: sourceGap.y + sourceGapOffset.y },
      ...points,
      { x: targetGap.x + targetGapOffset.x, y: targetGap.y + targetGapOffset.y },
      target,
    ];

    return { points: pathPoints };
  }

  private _getDirection(source: IPoint, sourceSide: EFConnectableSide, target: IPoint): IPoint {
    if (sourceSide === EFConnectableSide.LEFT || sourceSide === EFConnectableSide.RIGHT) {
      return source.x < target.x
        ? PointExtensions.initialize(1, 0)
        : PointExtensions.initialize(-1, 0);
    }

    return source.y < target.y
      ? PointExtensions.initialize(0, 1)
      : PointExtensions.initialize(0, -1);
  }
}

//
// import { IPoint, PointExtensions } from '@foblex/2d';
// import { IMap } from '../../../../../domain';
// import { calculateCenterBetweenPoints } from '../utils';
// import { createSegmentLinePath } from './create-segment-line-path';
// import {
//   IFConnectionBuilderResponse,
//   IFConnectionBuilder,
//   IFConnectionBuilderRequest,
// } from '../../models';
// import { EFConnectableSide } from '../../../../enums';
// import { IControlPoint } from '../../../../components';
//
// const CONNECTOR_SIDE_POINT: IMap<IPoint> = {
//   [EFConnectableSide.LEFT]: PointExtensions.initialize(-1, 0),
//
//   [EFConnectableSide.RIGHT]: PointExtensions.initialize(1, 0),
//
//   [EFConnectableSide.TOP]: PointExtensions.initialize(0, -1),
//
//   [EFConnectableSide.BOTTOM]: PointExtensions.initialize(0, 1),
//
//   [EFConnectableSide.AUTO]: PointExtensions.initialize(0, 0),
// };
//
// export class CalculateSegmentLineData implements IFConnectionBuilder {
//   public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
//     const { source, sourceSide, target, targetSide, pivots, offset, radius } = request;
//
//     const { points } = this._getPathPoints(source, sourceSide, target, targetSide, offset, pivots);
//
//     const penultimatePoint = points.length > 1 ? points[points.length - 2] : source;
//     const secondPoint = points.length > 1 ? points[1] : target;
//
//     return {
//       path: createSegmentLinePath(points, radius),
//       penultimatePoint,
//       secondPoint,
//       points,
//     };
//   }
//
//   private _getPathPoints(
//     source: IPoint,
//     sourceSide: EFConnectableSide,
//     target: IPoint,
//     targetSide: EFConnectableSide,
//     offset: number,
//     pivots: IControlPoint[],
//   ): { points: IPoint[] } {
//     const sourceDirection = CONNECTOR_SIDE_POINT[sourceSide];
//     const targetDirection = CONNECTOR_SIDE_POINT[targetSide];
//
//     const sourceGap: IPoint = {
//       x: source.x + sourceDirection.x * offset,
//       y: source.y + sourceDirection.y * offset,
//     };
//     const targetGap: IPoint = {
//       x: target.x + targetDirection.x * offset,
//       y: target.y + targetDirection.y * offset,
//     };
//
//     const direction = this._getDirection(sourceGap, sourceSide, targetGap);
//     const directionAccessor = direction.x !== 0 ? 'x' : 'y';
//     const currentDirection = direction[directionAccessor];
//
//     let points: IPoint[] = [];
//     const sourceGapOffset = PointExtensions.initialize();
//     const targetGapOffset = PointExtensions.initialize();
//
//     const centerBetweenPoints = calculateCenterBetweenPoints(source, target);
//
//     if (sourceDirection[directionAccessor] * targetDirection[directionAccessor] === -1) {
//       const verticalSplit: IPoint[] = [
//         { x: centerBetweenPoints.x, y: sourceGap.y },
//         { x: centerBetweenPoints.x, y: targetGap.y },
//       ];
//       const horizontalSplit: IPoint[] = [
//         { x: sourceGap.x, y: centerBetweenPoints.y },
//         { x: targetGap.x, y: centerBetweenPoints.y },
//       ];
//
//       if (sourceDirection[directionAccessor] === currentDirection) {
//         points = directionAccessor === 'x' ? verticalSplit : horizontalSplit;
//       } else {
//         points = directionAccessor === 'x' ? horizontalSplit : verticalSplit;
//       }
//     } else {
//       const sourceTarget: IPoint[] = [{ x: sourceGap.x, y: targetGap.y }];
//       const targetSource: IPoint[] = [{ x: targetGap.x, y: sourceGap.y }];
//
//       if (directionAccessor === 'x') {
//         points = sourceDirection.x === currentDirection ? targetSource : sourceTarget;
//       } else {
//         points = sourceDirection.y === currentDirection ? sourceTarget : targetSource;
//       }
//
//       if (sourceSide === targetSide) {
//         const diff = Math.abs(source[directionAccessor] - target[directionAccessor]);
//
//         if (diff <= offset) {
//           const gapOffset = Math.min(offset - 1, offset - diff);
//           if (sourceDirection[directionAccessor] === currentDirection) {
//             sourceGapOffset[directionAccessor] =
//               (sourceGap[directionAccessor] > source[directionAccessor] ? -1 : 1) * gapOffset;
//           } else {
//             targetGapOffset[directionAccessor] =
//               (targetGap[directionAccessor] > target[directionAccessor] ? -1 : 1) * gapOffset;
//           }
//         }
//       }
//
//       if (sourceSide !== targetSide) {
//         const dirAccessorOpposite = directionAccessor === 'x' ? 'y' : 'x';
//         const isSameDir =
//           sourceDirection[directionAccessor] === targetDirection[dirAccessorOpposite];
//         const sourceGtTargetOppo = sourceGap[dirAccessorOpposite] > targetGap[dirAccessorOpposite];
//         const sourceLtTargetOppo = sourceGap[dirAccessorOpposite] < targetGap[dirAccessorOpposite];
//         const flipSourceTarget =
//           (sourceDirection[directionAccessor] === 1 &&
//             ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
//           (sourceDirection[directionAccessor] !== 1 &&
//             ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));
//
//         if (flipSourceTarget) {
//           points = directionAccessor === 'x' ? sourceTarget : targetSource;
//         }
//       }
//     }
//
//     const pathPoints = [
//       source,
//       { x: sourceGap.x + sourceGapOffset.x, y: sourceGap.y + sourceGapOffset.y },
//       ...points,
//       { x: targetGap.x + targetGapOffset.x, y: targetGap.y + targetGapOffset.y },
//       target,
//     ];
//
//     return { points: pathPoints };
//   }
//
//   private _getDirection(source: IPoint, sourceSide: EFConnectableSide, target: IPoint): IPoint {
//     if (sourceSide === EFConnectableSide.LEFT || sourceSide === EFConnectableSide.RIGHT) {
//       return source.x < target.x
//         ? PointExtensions.initialize(1, 0)
//         : PointExtensions.initialize(-1, 0);
//     }
//
//     return source.y < target.y
//       ? PointExtensions.initialize(0, 1)
//       : PointExtensions.initialize(0, -1);
//   }
// }
