import { GetIntersections, ILine, IPoint, Line } from '@foblex/2d';
import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior.request';

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
  return new Line(
    from ? from : payload.outputRect.gravityCenter,
    to ? to : payload.inputRect.gravityCenter
  );
}
