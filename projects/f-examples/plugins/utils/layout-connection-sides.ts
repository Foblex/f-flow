import { EFConnectionConnectableSide, EFLayoutDirection } from '@foblex/flow';
import { EElkLayoutAlgorithm } from '@foblex/flow-elk-layout';

export interface ILayoutConnectionSides {
  source: EFConnectionConnectableSide;
  target: EFConnectionConnectableSide;
}

const DIRECTIONAL_LAYOUT_CONNECTION_SIDES: Record<EFLayoutDirection, ILayoutConnectionSides> = {
  [EFLayoutDirection.TOP_BOTTOM]: {
    source: EFConnectionConnectableSide.BOTTOM,
    target: EFConnectionConnectableSide.TOP,
  },
  [EFLayoutDirection.BOTTOM_TOP]: {
    source: EFConnectionConnectableSide.TOP,
    target: EFConnectionConnectableSide.BOTTOM,
  },
  [EFLayoutDirection.LEFT_RIGHT]: {
    source: EFConnectionConnectableSide.RIGHT,
    target: EFConnectionConnectableSide.LEFT,
  },
  [EFLayoutDirection.RIGHT_LEFT]: {
    source: EFConnectionConnectableSide.LEFT,
    target: EFConnectionConnectableSide.RIGHT,
  },
};

const CALCULATABLE_ELK_ALGORITHMS = new Set<EElkLayoutAlgorithm>([
  EElkLayoutAlgorithm.FIXED,
  EElkLayoutAlgorithm.BOX,
  EElkLayoutAlgorithm.RANDOM,
  EElkLayoutAlgorithm.STRESS,
  EElkLayoutAlgorithm.RADIAL,
  EElkLayoutAlgorithm.FORCE,
  EElkLayoutAlgorithm.DISCO,
  EElkLayoutAlgorithm.SPORE_OVERLAP,
  EElkLayoutAlgorithm.SPORE_COMPACTION,
  EElkLayoutAlgorithm.RECT_PACKING,
]);

const CALCULATABLE_LAYOUT_CONNECTION_SIDES: ILayoutConnectionSides = {
  source: EFConnectionConnectableSide.CALCULATE,
  target: EFConnectionConnectableSide.CALCULATE,
};

export function getDirectionalLayoutConnectionSides(
  direction: EFLayoutDirection,
): ILayoutConnectionSides {
  return DIRECTIONAL_LAYOUT_CONNECTION_SIDES[direction];
}

export function getElkLayoutConnectionSides(
  direction: EFLayoutDirection,
  algorithm: EElkLayoutAlgorithm,
): ILayoutConnectionSides {
  if (CALCULATABLE_ELK_ALGORITHMS.has(algorithm)) {
    return CALCULATABLE_LAYOUT_CONNECTION_SIDES;
  }

  return getDirectionalLayoutConnectionSides(direction);
}
