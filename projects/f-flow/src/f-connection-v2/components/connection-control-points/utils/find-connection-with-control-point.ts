import { IPoint } from '@foblex/2d';
import { Signal } from '@angular/core';

import { FConnectionControlPointsBase, IControlPointCandidate } from '../models';
import { findCandidatePoint } from './find-candidate-point';
import { findPivotPoint } from './find-pivot-point';

type ConnectionWithPivot<T> = {
  connection: T;
  pivot: IPoint;
  candidate?: never;
};

type ConnectionWithCandidate<T> = {
  connection: T;
  candidate: IControlPointCandidate;
  pivot?: never;
};

export type ConnectionWithControlPoint<T> = ConnectionWithPivot<T> | ConnectionWithCandidate<T>;

export type HasControlPoints = {
  fControlPoints: Signal<FConnectionControlPointsBase | undefined>;
};

export function findConnectionWithControlPoint<T extends HasControlPoints>(
  connections: readonly T[],
  position: IPoint,
): ConnectionWithControlPoint<T> | undefined {
  for (const connection of connections) {
    const pivot = findPivotPoint(connection, position);
    if (pivot) {
      return { connection, pivot };
    }

    const candidate = findCandidatePoint(connection, position);
    if (candidate) {
      return { connection, candidate };
    }
  }

  return undefined;
}
