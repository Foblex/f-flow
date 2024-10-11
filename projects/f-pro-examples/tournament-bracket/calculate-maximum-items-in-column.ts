import { IMap } from '@foblex/flow';
import { ITournamentBracketItem } from './i-tournament-bracket-item';

export function calculateMaximumItemsInColumn(columns: IMap<number>, items: ITournamentBracketItem[]): number {
  const result: IMap<number> = {};

  Object.entries(columns).forEach((value: [ phase: string, columnIndex: number ]) => {
    if (!result[ value[ 1 ] ]) {
      result[ value[ 1 ] ] = 0;
    }
    result[ value[ 1 ] ] += items.filter((item) => item.competitionPhase.toLowerCase() === value[ 0 ]).length;
  });

  return Math.max(...Object.values(result))
}
