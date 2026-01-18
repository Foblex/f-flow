import { IPoint } from '@foblex/2d';
import { FConnectionControlPointsBase } from '../../../components';
import { Signal } from '@angular/core';

export function isExistingControlPoint(
  connection: { fConnectionControlPoints: Signal<FConnectionControlPointsBase | undefined> },
  position: IPoint,
): boolean {
  const component = connection.fConnectionControlPoints();
  const radius = component?.radius() || 8;

  return component?.points().some((x) => _isPointerInsidePoint(position, x, radius)) ?? false;
}

function _isPointerInsidePoint(point: IPoint, circleCenter: IPoint, radius: number): boolean {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= radius ** 2;
}
