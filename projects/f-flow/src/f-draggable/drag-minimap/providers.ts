import { CalculateFlowPointFromMinimapPoint } from './calculate-flow-point-from-minimap-point';
import { DragMinimapFinalize } from './drag-minimap-finalize';
import { DragMinimapPreparation } from './drag-minimap-preparation';

export const DRAG_MINIMAP_PROVIDERS = [
  CalculateFlowPointFromMinimapPoint,

  DragMinimapFinalize,

  DragMinimapPreparation,
];
