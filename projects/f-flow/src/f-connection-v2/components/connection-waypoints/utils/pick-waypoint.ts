import { IPoint } from '@foblex/2d';
import { Signal } from '@angular/core';

import { FConnectionWaypointsBase } from '../models';
import { findWaypointCandidate } from './find-waypoint-candidate';
import { findExistingWaypoint } from './find-existing-waypoint';

export type WaypointPick<T> =
  | { connection: T; waypoint: IPoint; candidate?: never }
  | { connection: T; candidate: IPoint; waypoint?: never };

type HasWaypoints = {
  fWaypoints: Signal<FConnectionWaypointsBase | undefined>;
};

export function pickWaypoint<T extends HasWaypoints>(
  connections: readonly T[],
  position: IPoint,
): WaypointPick<T> | undefined {
  for (const connection of connections) {
    const waypoint = findExistingWaypoint(connection, position);
    if (waypoint && connection.fWaypoints()?.visibility()) {
      return { connection, waypoint };
    }

    const candidate = findWaypointCandidate(connection, position);
    if (candidate && connection.fWaypoints()?.visibility()) {
      return { connection, candidate };
    }
  }

  return undefined;
}
