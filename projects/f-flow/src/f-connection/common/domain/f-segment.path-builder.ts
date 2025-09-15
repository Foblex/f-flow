import { IPoint, PointExtensions } from '@foblex/2d';
import { EFConnectableSide } from '../../../f-connectors';
import {
  CalculateCenterBetweenPointsHandler,
  CalculateCenterBetweenPointsRequest,
} from './calculate-center-between-points';
import {
  CalculateConnectionCenterHandler,
  CalculateConnectionCenterRequest,
} from './calculate-connection-center';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../f-connection-builder';
import { IMap } from '../../../domain';

const CONNECTOR_SIDE_POINT: IMap<IPoint> = {
  [EFConnectableSide.LEFT]: PointExtensions.initialize(-1, 0),

  [EFConnectableSide.RIGHT]: PointExtensions.initialize(1, 0),

  [EFConnectableSide.TOP]: PointExtensions.initialize(0, -1),

  [EFConnectableSide.BOTTOM]: PointExtensions.initialize(0, 1),

  [EFConnectableSide.AUTO]: PointExtensions.initialize(0, 0),
};

export class FSegmentPathBuilder implements IFConnectionBuilder {
  public handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const { source, sourceSide, target, targetSide } = request;

    const { points, center } = this._getPathPoints(
      source,
      sourceSide,
      target,
      targetSide,
      request.offset,
    );

    const path = this._buildPath(points, request.radius);

    const penultimatePoint = points.length > 1 ? points[points.length - 2] : source;
    const secondPoint = points.length > 1 ? points[1] : target;

    return {
      path,
      connectionCenter: center,
      penultimatePoint,
      secondPoint,
      points,
    };
  }

  private _getPathPoints(
    source: IPoint,
    sourceSide: EFConnectableSide,
    target: IPoint,
    targetSide: EFConnectableSide,
    offset: number,
  ): { points: IPoint[]; center: IPoint } {
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

    const centerBetweenPoints = new CalculateCenterBetweenPointsHandler().handle(
      new CalculateCenterBetweenPointsRequest(source, target),
    );

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

    const center = new CalculateConnectionCenterHandler().handle(
      new CalculateConnectionCenterRequest(pathPoints),
    );

    return { points: pathPoints, center };
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

  private _distance(a: IPoint, b: IPoint): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  private _buildPath(points: IPoint[], borderRadius: number): string {
    let path = '';
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let segment = '';

      if (i > 0 && i < points.length - 1) {
        segment = this._getBend(points[i - 1], p, points[i + 1], borderRadius);
      } else if (i === points.length - 1) {
        segment = this._buildLastLineSegment(i, p);
      } else {
        segment = this._buildMoveOrLineSegment(i, p);
      }
      path += segment;
    }

    return path;
  }

  private _getBend(a: IPoint, b: IPoint, c: IPoint, size: number): string {
    const bendSize = Math.min(this._distance(a, b) / 2, this._distance(b, c) / 2, size);
    const { x, y } = b;

    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
      return `L${x} ${y}`;
    }

    if (a.y === y) {
      const xDir = a.x < c.x ? -1 : 1;
      const yDir = a.y < c.y ? 1 : -1;

      return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
    }

    const xDir = a.x < c.x ? 1 : -1;
    const yDir = a.y < c.y ? -1 : 1;

    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
  }

  private _buildMoveOrLineSegment(index: number, point: IPoint): string {
    return `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`;
  }

  private _buildLastLineSegment(index: number, point: IPoint): string {
    return `L${point.x + 0.0002} ${point.y + 0.0002}`;
  }
}
