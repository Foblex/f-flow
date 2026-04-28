import { EFCanvasLayer } from '../enums';

/**
 * Default rendering order, bottom to top:
 * groups → connections → nodes (matches every Foblex Flow release before v18.6).
 */
export const F_DEFAULT_LAYER_ORDER: EFCanvasLayer[] = [
  EFCanvasLayer.GROUPS,
  EFCanvasLayer.CONNECTIONS,
  EFCanvasLayer.NODES,
];
