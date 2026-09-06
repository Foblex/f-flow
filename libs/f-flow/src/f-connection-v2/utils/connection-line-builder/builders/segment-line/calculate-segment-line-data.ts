import { IPoint, PointExtensions } from '@foblex/2d';
import {
  buildConnectionAnchors,
  calculateCenterBetweenPoints,
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

const HARD_VIOLATION_SCORE = 1000;
const ARRIVAL_AXIS_SCORE = 8;
const BEND_SCORE = 1;
const LENGTH_SCORE = 1e-6;
const NODE_ZONE_SCORE = 1;
const NODE_ZONE_SCORE_LIMIT = 600;

/**
 * Half-plane behind a connector — the side of the endpoint the node body
 * occupies. Route length inside it is penalized so waypoint routes prefer
 * going around the endpoint nodes instead of slicing through them.
 */
interface INodeZone {
  anchor: IPoint;
  direction: IPoint;
}

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

    const chains =
      anchors.length === 2
        ? [this._getPathPoints(source, sourceSide, target, targetSide, offset ?? 0)]
        : this._buildWaypointChains(anchors, sourceSide, targetSide, offset ?? 0);

    const candidates: IPoint[] = [];
    for (const chain of chains) {
      const candidate = this._calculateChainCandidate(chain);
      if (candidate) {
        candidates.push(candidate);
      }
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

  /**
   * Routes the connection through intermediate waypoints. Connector sides and
   * the connector gap apply only at the real endpoints; waypoints are
   * pass-through anchors, so no connector-like stubs appear around them. Each
   * chain is an explicit orthogonal route that never doubles back on the
   * direction it arrived with — a same-line reversal would be collapsed by
   * polyline normalization and would detach the path from the waypoint.
   */
  private _buildWaypointChains(
    anchors: IPoint[],
    sourceSide: EFConnectableSide,
    targetSide: EFConnectableSide,
    offset: number,
  ): IPoint[][] {
    const sourceDirection = CONNECTOR_SIDE_POINT[sourceSide];
    const targetDirection = CONNECTOR_SIDE_POINT[targetSide];

    const nodeZones: INodeZone[] = [
      { anchor: anchors[0], direction: { x: -sourceDirection.x, y: -sourceDirection.y } },
      {
        anchor: anchors[anchors.length - 1],
        direction: { x: -targetDirection.x, y: -targetDirection.y },
      },
    ].filter((zone) => zone.direction.x !== 0 || zone.direction.y !== 0);

    const chains: IPoint[][] = [];
    let leaveDirection: IPoint | null = null;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const isFirstChain = i === 0;
      const isLastChain = i === anchors.length - 2;

      let chain: IPoint[];

      if (isFirstChain) {
        const sourceGap: IPoint = {
          x: a.x + sourceDirection.x * offset,
          y: a.y + sourceDirection.y * offset,
        };
        const route = this._routeOrthogonal(sourceGap, sourceDirection, b, null, nodeZones);
        chain = [a, ...route];
      } else if (isLastChain) {
        const targetGap: IPoint = {
          x: b.x + targetDirection.x * offset,
          y: b.y + targetDirection.y * offset,
        };
        const stubDirection: IPoint = { x: -targetDirection.x, y: -targetDirection.y };
        const route = this._routeOrthogonal(a, leaveDirection, targetGap, stubDirection, nodeZones);
        chain = [...route, b];
      } else {
        chain = this._routeOrthogonal(a, leaveDirection, b, null, nodeZones);
      }

      chains.push(chain);
      leaveDirection = this._calculateArrivalDirection(isLastChain ? chain.slice(0, -1) : chain);
    }

    return chains;
  }

  /**
   * Connects two points with an axis-aligned route. Candidates are the
   * straight segment, both L-shapes, and both Z-shapes; the route that keeps
   * the constraints wins. `leaveDirection` is the motion the path arrived
   * with (its reversal as a first move is forbidden); `stubDirection` is the
   * upcoming connector stub motion (arriving against it is forbidden).
   * A non-dominant-axis arrival is only softly penalized, so waypoints are
   * entered along the axis they are farther away on.
   */
  private _routeOrthogonal(
    from: IPoint,
    leaveDirection: IPoint | null,
    to: IPoint,
    stubDirection: IPoint | null,
    nodeZones: INodeZone[],
  ): IPoint[] {
    if (from.x === to.x && from.y === to.y) {
      return [from];
    }

    const corners: IPoint[][] = [];

    if (from.x === to.x || from.y === to.y) {
      corners.push([]);
    }
    corners.push([{ x: to.x, y: from.y }]);
    corners.push([{ x: from.x, y: to.y }]);

    const centerBetweenPoints = calculateCenterBetweenPoints(from, to);
    corners.push([
      { x: centerBetweenPoints.x, y: from.y },
      { x: centerBetweenPoints.x, y: to.y },
    ]);
    corners.push([
      { x: from.x, y: centerBetweenPoints.y },
      { x: to.x, y: centerBetweenPoints.y },
    ]);

    const dominantAxis: 'x' | 'y' = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y) ? 'x' : 'y';

    let bestRoute: IPoint[] | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const cornerPoints of corners) {
      const route = this._compactRoute([from, ...cornerPoints, to]);
      const score = this._scoreRoute(route, leaveDirection, stubDirection, dominantAxis, nodeZones);

      if (score < bestScore) {
        bestScore = score;
        bestRoute = route;
      }
    }

    return bestRoute ?? [from, to];
  }

  private _compactRoute(points: IPoint[]): IPoint[] {
    const route: IPoint[] = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const last = route[route.length - 1];
      if (points[i].x !== last.x || points[i].y !== last.y) {
        route.push(points[i]);
      }
    }

    return route;
  }

  private _scoreRoute(
    route: IPoint[],
    leaveDirection: IPoint | null,
    stubDirection: IPoint | null,
    dominantAxis: 'x' | 'y',
    nodeZones: INodeZone[],
  ): number {
    let score = 0;
    let length = 0;
    let zoneLength = 0;

    for (let i = 0; i < route.length - 1; i++) {
      length += Math.abs(route[i + 1].x - route[i].x) + Math.abs(route[i + 1].y - route[i].y);

      for (const zone of nodeZones) {
        zoneLength += this._calculateSegmentLengthInZone(route[i], route[i + 1], zone);
      }
    }

    score += Math.min(NODE_ZONE_SCORE_LIMIT, zoneLength * NODE_ZONE_SCORE);

    const first = this._segmentDirection(route[0], route[1]);
    if (
      leaveDirection &&
      (leaveDirection.x !== 0 || leaveDirection.y !== 0) &&
      first.x === -leaveDirection.x &&
      first.y === -leaveDirection.y
    ) {
      score += HARD_VIOLATION_SCORE;
    }

    const arrival = this._segmentDirection(route[route.length - 2], route[route.length - 1]);
    if (stubDirection && arrival.x === -stubDirection.x && arrival.y === -stubDirection.y) {
      score += HARD_VIOLATION_SCORE;
    }

    if (!stubDirection && arrival[dominantAxis] === 0) {
      score += ARRIVAL_AXIS_SCORE;
    }

    return score + (route.length - 2) * BEND_SCORE + length * LENGTH_SCORE;
  }

  private _segmentDirection(a: IPoint, b: IPoint): IPoint {
    return { x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) };
  }

  /**
   * Length of the part of an axis-aligned segment lying inside the half-plane
   * behind a connector (where the endpoint's node body is).
   */
  private _calculateSegmentLengthInZone(a: IPoint, b: IPoint, zone: INodeZone): number {
    const zoneAxis: 'x' | 'y' = zone.direction.x !== 0 ? 'x' : 'y';
    const zoneSign = zone.direction[zoneAxis];
    const boundary = zone.anchor[zoneAxis];

    const start = (a[zoneAxis] - boundary) * zoneSign;
    const end = (b[zoneAxis] - boundary) * zoneSign;

    if (start <= 0 && end <= 0) {
      return 0;
    }

    const segmentLength = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    if (a[zoneAxis] === b[zoneAxis]) {
      return segmentLength;
    }

    const insideLength = Math.max(start, end) - Math.max(0, Math.min(start, end));

    return Math.min(segmentLength, Math.max(0, insideLength));
  }

  /**
   * Waypoint-creation candidate for one chain: the midpoint of its longest
   * straight segment. Corner rounding consumes at most half of each adjacent
   * segment, so this point always lies on the rendered path — a length-based
   * chain midpoint can land on a rounded corner and float off the line.
   */
  private _calculateChainCandidate(chain: IPoint[]): IPoint | null {
    let bestLength = 0;
    let candidate: IPoint | null = null;

    for (let i = 0; i < chain.length - 1; i++) {
      const length = Math.abs(chain[i + 1].x - chain[i].x) + Math.abs(chain[i + 1].y - chain[i].y);

      if (length > bestLength) {
        bestLength = length;
        candidate = {
          x: (chain[i].x + chain[i + 1].x) / 2,
          y: (chain[i].y + chain[i + 1].y) / 2,
        };
      }
    }

    return candidate;
  }

  private _calculateArrivalDirection(chain: IPoint[]): IPoint | null {
    for (let i = chain.length - 1; i > 0; i--) {
      const direction = this._segmentDirection(chain[i - 1], chain[i]);
      if (direction.x !== 0 || direction.y !== 0) {
        return direction;
      }
    }

    return null;
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
