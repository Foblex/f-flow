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

  // Handles can be drawn slightly off the raw waypoint (on the bend apex of a
  // rounded corner), so hit-test where they are rendered but hand back the
  // real waypoint — dragging always operates on the model value.
  const index = (component?.displayedWaypoints() ?? []).findIndex((x) =>
    isPointerInsidePoint(position, x, radius),
  );

  return index >= 0 ? component?.waypoints()[index] : undefined;
}
