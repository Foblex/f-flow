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

export const CONNECTIONS_PROVIDERS = [
  FCreateConnectionFinalizeExecution,

  FCreateConnectionDragHandlerPreparationExecution,

  FCreateConnectionFromOutletPreparationExecution,

  GetFirstConnectableOutputExecution,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  FReassignConnectionFinalizeExecution,

  FReassignConnectionPreparationExecution,
];
