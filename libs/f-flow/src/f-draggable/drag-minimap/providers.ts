import { CalculateFlowPointFromMinimapPoint } from './calculate-flow-point-from-minimap-point';
import { DragMinimapFinalize } from './drag-minimap-finalize';
import { DragMinimapPreparation } from './drag-minimap-preparation';
import { fExecution } from '../../_libs/f-mediator';
import { CalculateFlowPointFromMinimapPointRequest } from './calculate-flow-point-from-minimap-point/calculate-flow-point-from-minimap-point-request';
import { DragMinimapFinalizeRequest } from './drag-minimap-finalize/drag-minimap-finalize-request';
import { DragMinimapPreparationRequest } from './drag-minimap-preparation/drag-minimap-preparation-request';

export const DRAG_MINIMAP_PROVIDERS = [
  fExecution(CalculateFlowPointFromMinimapPointRequest, CalculateFlowPointFromMinimapPoint),

  fExecution(DragMinimapFinalizeRequest, DragMinimapFinalize),

  fExecution(DragMinimapPreparationRequest, DragMinimapPreparation),
];
