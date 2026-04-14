export type TTournamentBracketType = 'upper' | 'lower' | 'final';

export interface ITournamentPhaseMetadata {
  bracket: TTournamentBracketType;
  roundIndex: number;
}
