import { MINIMAP_DRAG_PREPARATION_PROVIDERS } from './minimap-drag-preparation';
import { MINIMAP_DRAG_FINALIZE_PROVIDERS } from './minimap-drag-finalize';
import { CalculateFlowPointFromMinimapPointExecution } from './calculate-flow-point-from-minimap-point';

export const F_MINIMAP_DRAG_AND_DROP_PROVIDERS = [

  CalculateFlowPointFromMinimapPointExecution,

  ...MINIMAP_DRAG_FINALIZE_PROVIDERS,

  ...MINIMAP_DRAG_PREPARATION_PROVIDERS,
];
