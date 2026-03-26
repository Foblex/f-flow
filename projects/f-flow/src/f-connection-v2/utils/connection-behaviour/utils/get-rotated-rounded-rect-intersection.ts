import { GetIntersections, IPoint, IRoundedRect, RoundedRect } from '@foblex/2d';
import { IConnectionEndpointRotationContext } from '../models';

export function getRotatedRoundedRectIntersection(
  from: IPoint,
  to: IPoint,
  rect: IRoundedRect,
  rotationContext?: IConnectionEndpointRotationContext,
): IPoint | undefined {
  if (!rotationContext || !rotationContext.rotationDeg) {
    return GetIntersections.getRoundedRectIntersections(from, to, rect)[0];
  }

  const localFrom = _rotatePoint(from, -rotationContext.rotationDeg, rotationContext.pivot);
  const localTo = _rotatePoint(to, -rotationContext.rotationDeg, rotationContext.pivot);
  const localRect = _rotateRect(rect, -rotationContext.rotationDeg, rotationContext.pivot);
  const intersection = GetIntersections.getRoundedRectIntersections(
    localFrom,
    localTo,
    localRect,
  )[0];

  return intersection
    ? _rotatePoint(intersection, rotationContext.rotationDeg, rotationContext.pivot)
    : undefined;
}

function _rotateRect(rect: IRoundedRect, rotationDeg: number, pivot: IPoint): IRoundedRect {
  const center = _rotatePoint(_getRectCenter(rect), rotationDeg, pivot);

  return new RoundedRect(
    center.x - rect.width / 2,
    center.y - rect.height / 2,
    rect.width,
    rect.height,
    rect.radius1,
    rect.radius2,
    rect.radius3,
    rect.radius4,
  );
}

function _getRectCenter(rect: IRoundedRect): IPoint {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function _rotatePoint(point: IPoint, rotationDeg: number, pivot: IPoint): IPoint {
  const translatedX = point.x - pivot.x;
  const translatedY = point.y - pivot.y;

  const theta = (rotationDeg * Math.PI) / 180;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  return {
    x: translatedX * cosTheta - translatedY * sinTheta + pivot.x,
    y: translatedX * sinTheta + translatedY * cosTheta + pivot.y,
  };
}
