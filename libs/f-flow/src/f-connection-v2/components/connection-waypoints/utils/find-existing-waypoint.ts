import { IPoint } from '@foblex/2d';
import { FConnectionWaypointsBase } from '../models';
import { Signal } from '@angular/core';
import { isPointerInsidePoint } from './is-pointer-inside-point';

export function findExistingWaypoint(
  connection: { fWaypoints: Signal<FConnectionWaypointsBase | undefined> },
  position: IPoint,
): IPoint | undefined {
  const component = connection.fWaypoints();
  const radius = component?.radius() || 8;

  return component?.waypoints().find((x) => isPointerInsidePoint(position, x, radius));
}
