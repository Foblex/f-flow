import { SizeExtensions } from '@foblex/2d';
import { EFLayoutDirection } from '@foblex/flow';
import { EElkLayoutAlgorithm } from '../enums';
import { IElkLayoutEngineOptions } from '../models';

export const DEFAULT_ELK_LAYOUT_ENGINE_OPTIONS: IElkLayoutEngineOptions = {
  direction: EFLayoutDirection.TOP_BOTTOM,
  nodeGap: 48,
  layerGap: 48,
  algorithm: EElkLayoutAlgorithm.LAYERED,
  defaultNodeSize: SizeExtensions.initialize(120, 72),
  layoutOptions: {},
};
