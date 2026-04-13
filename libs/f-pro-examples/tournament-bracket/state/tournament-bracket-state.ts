import { computed, Injectable, signal } from '@angular/core';
import {
  ITournamentBracketItem,
  layoutTournamentBracket,
  TOURNAMENT_BRACKET_STORE,
} from '../domain';

interface ITournamentBracketConnection {
  id: string;
  from: string;
  to: string;
}

@Injectable()
export class TournamentBracketState {
  private readonly _sourceMatches = signal<ITournamentBracketItem[]>(TOURNAMENT_BRACKET_STORE);

  public readonly matches = computed<ITournamentBracketItem[]>(() => {
    return layoutTournamentBracket(this._sourceMatches());
  });

  public readonly connections = computed<ITournamentBracketConnection[]>(() => {
    return this.matches()
      .filter(
        (item): item is ITournamentBracketItem & { nextMatchId: string } => !!item.nextMatchId,
      )
      .map((item) => ({
        id: `conn-${item.id}-${item.nextMatchId}`,
        from: item.id,
        to: item.nextMatchId,
      }));
  });
}
