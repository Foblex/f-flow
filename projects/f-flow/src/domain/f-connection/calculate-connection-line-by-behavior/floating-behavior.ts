import { GetIntersections, ILine, IPoint, IRoundedRect } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior-request';

/**
 * Floating behavior calculates the connection line
 * It constructs a line between the intersections of the connectors rectangles and line from the centers of the connector rectangles
 * @param payload
 */
export function floatingBehavior({
  sourceRect,
  targetRect,
}: CalculateConnectionLineByBehaviorRequest): ILine {
  return _getIntersectionsLine(
    _fromRoundedRectIntersections(sourceRect, targetRect),
    _toRoundedRectIntersections(sourceRect, targetRect),
    sourceRect,
    targetRect,
  );
}

function _fromRoundedRectIntersections(sourceRect: IRoundedRect, targetRect: IRoundedRect) {
  return GetIntersections.getRoundedRectIntersections(
    sourceRect.gravityCenter,
    targetRect.gravityCenter,
    sourceRect,
  )[0];
}

function _toRoundedRectIntersections(sourceRect: IRoundedRect, targetRect: IRoundedRect) {
  return GetIntersections.getRoundedRectIntersections(
    targetRect.gravityCenter,
    sourceRect.gravityCenter,
    targetRect,
  )[0];
}

function _getIntersectionsLine(
  from: IPoint,
  to: IPoint,
  sourceRect: IRoundedRect,
  targetRect: IRoundedRect,
): ILine {
  return {
    point1: from ? from : sourceRect.gravityCenter,
    point2: to ? to : targetRect.gravityCenter,
  };
}
