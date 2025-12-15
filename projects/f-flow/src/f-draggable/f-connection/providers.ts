import {
  FCreateConnectionDragHandlerPreparationExecution,
  FCreateConnectionFinalizeExecution,
  FCreateConnectionFromOutletPreparationExecution,
  CreateConnectionFromOutputPreparation,
  CreateConnectionPreparation,
  GetFirstConnectableOutputExecution,
} from './f-create-connection';
import {
  FReassignConnectionFinalizeExecution,
  FReassignConnectionPreparationExecution,
} from './f-reassign-connection';
import { FDragControlPointPreparationExecution } from './f-drag-control-point';

export const CONNECTIONS_PROVIDERS = [
  FCreateConnectionFinalizeExecution,

  FCreateConnectionDragHandlerPreparationExecution,

  FCreateConnectionFromOutletPreparationExecution,

  GetFirstConnectableOutputExecution,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  FReassignConnectionFinalizeExecution,

  FReassignConnectionPreparationExecution,

  FDragControlPointPreparationExecution,
];
