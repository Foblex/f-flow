import { IPoint } from '@foblex/2d';
import { ITournamentCompetitor } from './i-tournament-bracket-competitor';
import { TTournamentBracketType } from '../layout';

export type TMatchStatus = 'upcoming' | 'live' | 'completed';

export interface ITournamentMatch {
  id: string;
  phase: string;
  bracket: TTournamentBracketType;
  roundIndex: number;
  date: Date;
  status: TMatchStatus;
  competitors: ITournamentCompetitor[];
  nextMatchId?: string;
  position?: IPoint;
}
