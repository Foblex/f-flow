import { IFLayoutAlgorithmOptions } from '@foblex/flow';
import { ETournamentLayoutAlgorithm } from '../enums';
import { ITournamentPhaseMetadata } from './i-tournament-phase-metadata';

export interface ITournamentLayoutEngineOptions
  extends IFLayoutAlgorithmOptions<ETournamentLayoutAlgorithm> {
  phases: Record<string, ITournamentPhaseMetadata>;
}
