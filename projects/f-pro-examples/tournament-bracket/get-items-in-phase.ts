import { ITournamentBracketItem } from './i-tournament-bracket-item';

export function getItemsInPhase(phase: string, items: ITournamentBracketItem[]): ITournamentBracketItem[] {
  return items.filter((item) => item.competitionPhase.toLowerCase() === phase.toLowerCase());
}
