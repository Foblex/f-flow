import { IMap } from '@foblex/flow';

export function getPhasesByColumnIndex(columns: IMap<number>, columnIndex: number): string[] {
  return Object.entries(columns).filter((value) => value[ 1 ] === columnIndex).map((value) => value[ 0 ]);
}
