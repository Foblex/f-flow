import { IPoint } from '@foblex/2d';
import { ITournamentBracketCompetitor } from './i-tournament-bracket-competitor';

export type TTournamentMatchColor = 'blue' | 'yellow' | 'purple' | 'red' | 'green';

export interface ITournamentBracketItem {
  id: string;
  competitionPhase: string;
  color: TTournamentMatchColor;
  date: Date;
  competitors: ITournamentBracketCompetitor[];
  nextMatchId?: string;
  position?: IPoint;
}
