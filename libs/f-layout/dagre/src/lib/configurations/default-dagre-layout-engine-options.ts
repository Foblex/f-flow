import { SizeExtensions } from '@foblex/2d';
import { EFLayoutDirection } from '@foblex/flow';
import { EDagreLayoutAlgorithm } from '../enums';
import { IDagreLayoutEngineOptions } from '../models';

export const DEFAULT_DAGRE_LAYOUT_ENGINE_OPTIONS: IDagreLayoutEngineOptions = {
  direction: EFLayoutDirection.TOP_BOTTOM,
  nodeGap: 48,
  layerGap: 64,
  algorithm: EDagreLayoutAlgorithm.NETWORK_SIMPLEX,
  defaultNodeSize: SizeExtensions.initialize(120, 72),
};
