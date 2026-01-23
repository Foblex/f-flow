import { IPoint } from '@foblex/2d';
import { FConnectionControlPointsBase } from '../models';
import { Signal } from '@angular/core';
import { isPointerInsidePoint } from './is-pointer-inside-point';

export function findPivotPoint(
  connection: { fControlPoints: Signal<FConnectionControlPointsBase | undefined> },
  position: IPoint,
): IPoint | undefined {
  const component = connection.fControlPoints();
  const radius = component?.radius() || 8;

  return component?.pivots().find((x) => isPointerInsidePoint(position, x, radius));
}
