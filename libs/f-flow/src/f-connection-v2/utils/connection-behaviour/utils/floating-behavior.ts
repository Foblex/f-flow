import { ILine, IPoint, IRoundedRect } from '@foblex/2d';
import { ICalculateBehaviorRequest } from '../models';
import { getRotatedRoundedRectIntersection } from './get-rotated-rounded-rect-intersection';

/**
 * Floating behavior calculates the connection line
 * It constructs a line between the intersections of the connectors rectangles and line from the centers of the connector rectangles
 * @param payload
 */
export function floatingBehavior({
  sourceRect,
  targetRect,
  sourceRotationContext,
  targetRotationContext,
}: ICalculateBehaviorRequest): ILine {
  return _getIntersectionsLine(
    _fromRoundedRectIntersections(sourceRect, targetRect, sourceRotationContext),
    _toRoundedRectIntersections(sourceRect, targetRect, targetRotationContext),
    sourceRect,
    targetRect,
  );
}

function _fromRoundedRectIntersections(
  sourceRect: IRoundedRect,
  targetRect: IRoundedRect,
  rotationContext: ICalculateBehaviorRequest['sourceRotationContext'],
) {
  return getRotatedRoundedRectIntersection(
    sourceRect.gravityCenter,
    targetRect.gravityCenter,
    sourceRect,
    rotationContext,
  );
}

function _toRoundedRectIntersections(
  sourceRect: IRoundedRect,
  targetRect: IRoundedRect,
  rotationContext: ICalculateBehaviorRequest['targetRotationContext'],
) {
  return getRotatedRoundedRectIntersection(
    targetRect.gravityCenter,
    sourceRect.gravityCenter,
    targetRect,
    rotationContext,
  );
}

function _getIntersectionsLine(
  from: IPoint | undefined,
  to: IPoint | undefined,
  sourceRect: IRoundedRect,
  targetRect: IRoundedRect,
): ILine {
  return {
    point1: from ? from : sourceRect.gravityCenter,
    point2: to ? to : targetRect.gravityCenter,
  };
}
