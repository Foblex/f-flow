import { KeyValue } from '@angular/common';
import { EFLayoutDirection } from '@foblex/flow';
import { EDagreLayoutAlgorithm } from '@foblex/flow-dagre-layout';
import { EElkLayoutAlgorithm } from '@foblex/flow-elk-layout';

export enum ELayoutSpacingPreset {
  COMPACT = 'COMPACT',
  SPACIOUS = 'SPACIOUS',
}

export interface ILayoutSpacingPreset {
  nodeGap: number;
  layerGap: number;
}

export const LAYOUT_DIRECTION_OPTIONS: KeyValue<EFLayoutDirection, string>[] = [
  { key: EFLayoutDirection.TOP_BOTTOM, value: 'Top to Bottom' },
  { key: EFLayoutDirection.BOTTOM_TOP, value: 'Bottom to Top' },
  { key: EFLayoutDirection.LEFT_RIGHT, value: 'Left to Right' },
  { key: EFLayoutDirection.RIGHT_LEFT, value: 'Right to Left' },
];

export const DAGRE_LAYOUT_ALGORITHM_OPTIONS: KeyValue<EDagreLayoutAlgorithm, string>[] = [
  { key: EDagreLayoutAlgorithm.NETWORK_SIMPLEX, value: 'Network Simplex' },
  { key: EDagreLayoutAlgorithm.TIGHT_TREE, value: 'Tight Tree' },
  { key: EDagreLayoutAlgorithm.LONGEST_PATH, value: 'Longest Path' },
];

export const ELK_LAYOUT_ALGORITHM_OPTIONS: KeyValue<EElkLayoutAlgorithm, string>[] = [
  { key: EElkLayoutAlgorithm.FIXED, value: 'Fixed' },
  { key: EElkLayoutAlgorithm.BOX, value: 'Box' },
  { key: EElkLayoutAlgorithm.RANDOM, value: 'Randomizer' },
  { key: EElkLayoutAlgorithm.LAYERED, value: 'Layered' },
  { key: EElkLayoutAlgorithm.STRESS, value: 'Stress' },
  { key: EElkLayoutAlgorithm.MRTREE, value: 'Mr. Tree' },
  { key: EElkLayoutAlgorithm.RADIAL, value: 'Radial' },
  { key: EElkLayoutAlgorithm.FORCE, value: 'Force' },
  { key: EElkLayoutAlgorithm.DISCO, value: 'Disco' },
  { key: EElkLayoutAlgorithm.SPORE_OVERLAP, value: 'SPOrE Overlap Removal' },
  { key: EElkLayoutAlgorithm.SPORE_COMPACTION, value: 'SPOrE Compaction' },
  { key: EElkLayoutAlgorithm.RECT_PACKING, value: 'Rectangle Packing' },
];

export const LAYOUT_SPACING_OPTIONS: KeyValue<ELayoutSpacingPreset, string>[] = [
  { key: ELayoutSpacingPreset.COMPACT, value: 'Compact' },
  { key: ELayoutSpacingPreset.SPACIOUS, value: 'Spacious' },
];

export const LAYOUT_SPACING_PRESETS: Record<ELayoutSpacingPreset, ILayoutSpacingPreset> = {
  [ELayoutSpacingPreset.COMPACT]: {
    nodeGap: 32,
    layerGap: 40,
  },
  [ELayoutSpacingPreset.SPACIOUS]: {
    nodeGap: 72,
    layerGap: 88,
  },
};

export function getLayoutSpacingPreset(nodeGap: number, layerGap: number): ELayoutSpacingPreset {
  const preset = (
    Object.entries(LAYOUT_SPACING_PRESETS) as [ELayoutSpacingPreset, ILayoutSpacingPreset][]
  ).find(([, value]) => value.nodeGap === nodeGap && value.layerGap === layerGap);

  return preset?.[0] ?? ELayoutSpacingPreset.SPACIOUS;
}
