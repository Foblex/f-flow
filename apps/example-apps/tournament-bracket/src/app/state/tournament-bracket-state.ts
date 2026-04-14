import { computed, Injectable, signal } from '@angular/core';
import { ITournamentMatch, TOURNAMENT_SEED_DATA } from '../domain';
import {
  ETournamentLayoutAlgorithm,
  ITournamentPhaseMetadata,
  TTournamentBracketType,
} from '../layout';

export interface ITournamentConnection {
  id: string;
  from: string;
  to: string;
}

@Injectable()
export class TournamentBracketState {
  private readonly _matches = signal<ITournamentMatch[]>(TOURNAMENT_SEED_DATA);

  private readonly _algorithm = signal<ETournamentLayoutAlgorithm>(
    ETournamentLayoutAlgorithm.STANDARD,
  );

  private readonly _selectedMatchId = signal<string | null>(null);

  private readonly _selectedTeam = signal<string | null>(null);

  private readonly _visibleBrackets = signal<Set<TTournamentBracketType>>(
    new Set(['upper', 'lower', 'final']),
  );

  public readonly algorithm = this._algorithm.asReadonly();

  public readonly selectedMatchId = this._selectedMatchId.asReadonly();

  public readonly selectedTeam = this._selectedTeam.asReadonly();

  public readonly visibleBrackets = this._visibleBrackets.asReadonly();

  public readonly matches = this._matches.asReadonly();

  public readonly visibleMatches = computed<ITournamentMatch[]>(() => {
    const visible = this._visibleBrackets();

    return this._matches().filter((m) => visible.has(m.bracket));
  });

  public readonly connections = computed<ITournamentConnection[]>(() => {
    const visibleIds = new Set(this.visibleMatches().map((m) => m.id));

    return this._matches()
      .filter(
        (match): match is ITournamentMatch & { nextMatchId: string } =>
          !!match.nextMatchId && visibleIds.has(match.id) && visibleIds.has(match.nextMatchId),
      )
      .map((match) => ({
        id: `conn-${match.id}-${match.nextMatchId}`,
        from: match.id,
        to: match.nextMatchId,
      }));
  });

  public readonly phaseMetadata = computed<Record<string, ITournamentPhaseMetadata>>(() => {
    const metadata: Record<string, ITournamentPhaseMetadata> = {};

    this.visibleMatches().forEach((match) => {
      metadata[match.id] = { bracket: match.bracket, roundIndex: match.roundIndex };
    });

    return metadata;
  });

  public readonly highlightedMatchIds = computed<Set<string>>(() => {
    const matchId = this._selectedMatchId();
    const team = this._selectedTeam();

    if (team) {
      return this._getTeamJourneyIds(team);
    }

    if (matchId) {
      return this._getMatchPathIds(matchId);
    }

    return new Set();
  });

  public readonly highlightedConnectionIds = computed<Set<string>>(() => {
    const highlighted = this.highlightedMatchIds();
    if (highlighted.size === 0) {
      return new Set();
    }

    const ids = new Set<string>();

    this.connections().forEach((conn) => {
      if (highlighted.has(conn.from) && highlighted.has(conn.to)) {
        ids.add(conn.id);
      }
    });

    return ids;
  });

  public readonly selectedMatch = computed<ITournamentMatch | null>(() => {
    const id = this._selectedMatchId();

    if (!id) {
      return null;
    }

    return this.visibleMatches().find((m) => m.id === id) ?? null;
  });

  public readonly allTeams = computed<string[]>(() => {
    const teams = new Set<string>();

    this._matches().forEach((m) => {
      m.competitors.forEach((c) => teams.add(c.name));
    });

    return Array.from(teams).sort();
  });

  public readonly tournamentStats = computed(() => {
    const matches = this._matches();
    const upper = matches.filter((m) => m.bracket === 'upper').length;
    const lower = matches.filter((m) => m.bracket === 'lower').length;
    const final = matches.filter((m) => m.bracket === 'final').length;
    const completed = matches.filter((m) => m.status === 'completed').length;
    const live = matches.filter((m) => m.status === 'live').length;
    const upcoming = matches.filter((m) => m.status === 'upcoming').length;

    return { total: matches.length, upper, lower, final, completed, live, upcoming };
  });

  public setAlgorithm(algorithm: ETournamentLayoutAlgorithm): void {
    this._algorithm.set(algorithm);
  }

  public selectMatch(matchId: string | null): void {
    this._selectedTeam.set(null);
    this._selectedMatchId.set(matchId === this._selectedMatchId() ? null : matchId);
  }

  public selectTeam(teamName: string | null): void {
    this._selectedMatchId.set(null);
    this._selectedTeam.set(teamName === this._selectedTeam() ? null : teamName);
  }

  public clearSelection(): void {
    this._selectedMatchId.set(null);
    this._selectedTeam.set(null);
  }

  public toggleBracket(bracket: TTournamentBracketType): void {
    const current = new Set(this._visibleBrackets());

    if (current.has(bracket) && current.size > 1) {
      current.delete(bracket);
    } else {
      current.add(bracket);
    }

    this._visibleBrackets.set(current);
    this._syncSelectionWithVisibility();
  }

  public showAllBrackets(): void {
    this._visibleBrackets.set(new Set(['upper', 'lower', 'final']));
    this._syncSelectionWithVisibility();
  }

  private _getMatchPathIds(matchId: string): Set<string> {
    const ids = new Set<string>();
    const visibleMatches = this.visibleMatches();
    const matchMap = new Map(visibleMatches.map((m) => [m.id, m]));

    const addAncestors = (id: string): void => {
      ids.add(id);

      visibleMatches.forEach((m) => {
        if (m.nextMatchId === id && !ids.has(m.id)) {
          addAncestors(m.id);
        }
      });
    };

    const addDescendants = (id: string): void => {
      ids.add(id);
      const match = matchMap.get(id);
      if (match?.nextMatchId && !ids.has(match.nextMatchId)) {
        addDescendants(match.nextMatchId);
      }
    };

    addAncestors(matchId);
    addDescendants(matchId);

    return ids;
  }

  private _getTeamJourneyIds(teamName: string): Set<string> {
    const ids = new Set<string>();

    this.visibleMatches().forEach((m) => {
      if (m.competitors.some((c) => c.name === teamName)) {
        ids.add(m.id);
      }
    });

    return ids;
  }

  private _syncSelectionWithVisibility(): void {
    const visibleMatchIds = new Set(this.visibleMatches().map((match) => match.id));
    const selectedMatchId = this._selectedMatchId();

    if (selectedMatchId && !visibleMatchIds.has(selectedMatchId)) {
      this._selectedMatchId.set(null);
    }

    const selectedTeam = this._selectedTeam();

    if (
      selectedTeam &&
      !this.visibleMatches().some((match) =>
        match.competitors.some((competitor) => competitor.name === selectedTeam),
      )
    ) {
      this._selectedTeam.set(null);
    }
  }
}
