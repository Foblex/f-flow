import { IPoint } from '@foblex/2d';
import { Signal } from '@angular/core';

import { FConnectionControlPointsBase, IPivotCandidate } from '../models';
import { findPivotCandidate } from './find-pivot-candidate';
import { findPivot } from './find-pivot';

type ConnectionWithPivot<T> = {
  connection: T;
  pivot: IPoint;
  candidate?: never;
};

type ConnectionWithCandidate<T> = {
  connection: T;
  candidate: IPivotCandidate;
  pivot?: never;
};

export type ConnectionWithControlPoint<T> = ConnectionWithPivot<T> | ConnectionWithCandidate<T>;

export type HasControlPoints = {
  fControlPoints: Signal<FConnectionControlPointsBase | undefined>;
};

export function findConnectionWithPivotAndCandidate<T extends HasControlPoints>(
  connections: readonly T[],
  position: IPoint,
): ConnectionWithControlPoint<T> | undefined {
  for (const connection of connections) {
    const pivot = findPivot(connection, position);
    if (pivot) {
      return { connection, pivot };
    }

    const candidate = findPivotCandidate(connection, position);
    if (candidate) {
      return { connection, candidate };
    }
  }

  return undefined;
}
