import { ITournamentBracketCompetitor } from './i-tournament-bracket-competitor';
import { IPoint } from '@foblex/2d';

export interface ITournamentBracketItem {

  position?: IPoint;

  id: string;

  competitionPhase: string;

  color: string;

  date: Date;

  competitors: ITournamentBracketCompetitor[];

  nextMatchId: string;
}
