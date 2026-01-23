import { Signal } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { isPointerInsidePoint } from './is-pointer-inside-point';
import { FConnectionControlPointsBase, IControlPointCandidate } from '../models';

export function findCandidatePoint(
  connection: { fControlPoints: Signal<FConnectionControlPointsBase | undefined> },
  position: IPoint,
): IControlPointCandidate | undefined {
  const component = connection.fControlPoints();
  const radius = component?.radius() || 8;

  return component?.candidates().find((x) => isPointerInsidePoint(position, x.point, radius));
}
