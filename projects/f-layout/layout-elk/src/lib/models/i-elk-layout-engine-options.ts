import { IFLayoutAlgorithmOptions } from '@foblex/flow';
import { EElkLayoutAlgorithm } from '../enums';

export interface IElkLayoutEngineOptions extends IFLayoutAlgorithmOptions<EElkLayoutAlgorithm> {
  layoutOptions?: Record<string, string>;
}
