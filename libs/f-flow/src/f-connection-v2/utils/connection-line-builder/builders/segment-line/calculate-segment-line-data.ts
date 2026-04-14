import { IPoint, PointExtensions } from '@foblex/2d';
import {
  buildConnectionAnchors,
  calculateCenterBetweenPoints,
  calculatePolylineCandidates,
  mergePointChains,
  normalizePolyline,
} from '../utils';
import { createSegmentLinePath } from './create-segment-line-path';
import {
  IFConnectionBuilder,
  IFConnectionBuilderRequest,
  IFConnectionBuilderResponse,
} from '../../models';
import { EFConnectableSide } from '../../../../enums';
import { buildCornerMidPointsAndApplyOffsets } from './build-corner-mid-points-and-apply-offsets';

const CONNECTOR_SIDE_POINT: Record<string, IPoint> = {
  [EFConnectableSide.LEFT]: PointExtensions.initialize(-1, 0),

  [EFConnectableSide.RIGHT]: PointExtensions.initialize(1, 0),

  [EFConnectableSide.TOP]: PointExtensions.initialize(0, -1),

  [EFConnectableSide.BOTTOM]: PointExtensions.initialize(0, 1),

  [EFConnectableSide.AUTO]: PointExtensions.initialize(0, 0),
};

export class CalculateSegmentLineData implements IFConnectionBuilder {
  public handle({
    source,
    sourceSide,
    target,
    targetSide,
    waypoints,
    offset,
    radius,
  }: IFConnectionBuilderRequest): IFConnectionBuilderResponse {
    const anchors = buildConnectionAnchors(source, target, waypoints);

    const chains: IPoint[][] = [];
    const candidates: IPoint[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];

      const points = this._getPathPoints(a, sourceSide, b, targetSide, offset ?? 0);

      chains.push(points);
      candidates.push(...calculatePolylineCandidates(points));
    }

    const polyline = normalizePolyline(mergePointChains(chains));

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
  ): IPoint[] {
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
    const directionAccessor: 'x' | 'y' = direction.x !== 0 ? 'x' : 'y';
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
      points = buildCornerMidPointsAndApplyOffsets({
        axis: directionAccessor,
        source,
        target,
        sourceSide,
        targetSide,
        sourceGap,
        targetGap,
        sourceDir: sourceDirection,
        targetDir: targetDirection,
        currentDir: currentDirection,
        offset,
        sourceGapOffset,
        targetGapOffset,
      });
    }

    return [
      source,
      { x: sourceGap.x + sourceGapOffset.x, y: sourceGap.y + sourceGapOffset.y },
      ...points,
      { x: targetGap.x + targetGapOffset.x, y: targetGap.y + targetGapOffset.y },
      target,
    ];
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
