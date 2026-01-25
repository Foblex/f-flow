import { Signal } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { isPointerInsidePoint } from './is-pointer-inside-point';
import { FConnectionWaypointsBase } from '../models';

export function findWaypointCandidate(
  connection: { fWaypoints: Signal<FConnectionWaypointsBase | undefined> },
  position: IPoint,
): IPoint | undefined {
  const component = connection.fWaypoints();
  const radius = component?.radius() || 8;

  return component?.candidates().find((x) => isPointerInsidePoint(position, x, radius));
}
