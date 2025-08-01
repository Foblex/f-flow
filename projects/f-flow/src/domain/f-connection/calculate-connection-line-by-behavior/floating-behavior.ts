import { GetIntersections, ILine, IPoint } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';

/**
 * Floating behavior calculates the connection line
 * It constructs a line between the intersections of the connectors rectangles and line from the centers of the connector rectangles
 * @param payload
 */
export function floatingBehavior(payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return _getIntersectionsLine(
    _fromRoundedRectIntersections(payload),
    _toRoundedRectIntersections(payload),
    payload
  );
}

function _fromRoundedRectIntersections(payload: CalculateConnectionLineByBehaviorRequest) {
  return GetIntersections.getRoundedRectIntersections(
    payload.outputRect.gravityCenter, payload.inputRect.gravityCenter, payload.outputRect
  )[ 0 ];
}

function _toRoundedRectIntersections(payload: CalculateConnectionLineByBehaviorRequest) {
  return GetIntersections.getRoundedRectIntersections(
    payload.inputRect.gravityCenter, payload.outputRect.gravityCenter, payload.inputRect
  )[ 0 ];
}

function _getIntersectionsLine(from: IPoint, to: IPoint, payload: CalculateConnectionLineByBehaviorRequest): ILine {
  return {
    point1: from ? from : payload.outputRect.gravityCenter,
    point2: to ? to : payload.inputRect.gravityCenter
  };
}
