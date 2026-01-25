import { ITournamentBracketItem } from './i-tournament-bracket-item';

export function calculateMaximumItemsInColumn(columns: Record<string, number>, items: ITournamentBracketItem[]): number {
  const result: Record<string, number> = {};

  Object.entries(columns).forEach((value: [ phase: string, columnIndex: number ]) => {
    if (!result[ value[ 1 ] ]) {
      result[ value[ 1 ] ] = 0;
    }
    result[ value[ 1 ] ] += items.filter((item) => item.competitionPhase.toLowerCase() === value[ 0 ]).length;
  });

  return Math.max(...Object.values(result))
}
