import { SizeExtensions } from '@foblex/2d';
import { EFLayoutDirection } from '@foblex/flow';
import { ETournamentLayoutAlgorithm } from '../enums';
import { ITournamentLayoutEngineOptions } from '../models';

export const DEFAULT_TOURNAMENT_LAYOUT_ENGINE_OPTIONS: ITournamentLayoutEngineOptions = {
  direction: EFLayoutDirection.LEFT_RIGHT,
  nodeGap: 80,
  layerGap: 120,
  algorithm: ETournamentLayoutAlgorithm.STANDARD,
  defaultNodeSize: SizeExtensions.initialize(220, 120),
  phases: {},
};
