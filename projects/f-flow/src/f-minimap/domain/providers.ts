import { MINIMAP_DRAG_PREPARATION_PROVIDERS } from './minimap-drag-preparation';
import { MINIMAP_DRAG_FINALIZE_PROVIDERS } from './minimap-drag-finalize';
import { CalculateFlowPointFromMinimapPointExecution } from './calculate-flow-point-from-minimap-point';
import { MinimapDrawNodesExecution } from './minimap-draw-nodes';
import { MinimapCalculateViewBoxExecution } from './minimap-calculate-view-box';
import { MinimapCalculateSvgScaleAndViewBoxExecution } from './minimap-calculate-svg-scale-and-view-box';

export const F_MINIMAP_DRAG_AND_DROP_PROVIDERS = [

  CalculateFlowPointFromMinimapPointExecution,

  ...MINIMAP_DRAG_FINALIZE_PROVIDERS,

  ...MINIMAP_DRAG_PREPARATION_PROVIDERS,

  MinimapDrawNodesExecution,

  MinimapCalculateSvgScaleAndViewBoxExecution,

  MinimapCalculateViewBoxExecution,
];
