import {
  FCreateConnectionDragHandlerPreparationExecution,
  FCreateConnectionFinalizeExecution,
  FCreateConnectionFromOutletPreparationExecution,
  FCreateConnectionFromOutputPreparationExecution,
  FCreateConnectionPreparationExecution,
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

  FCreateConnectionFromOutputPreparationExecution,

  FCreateConnectionPreparationExecution,

  FReassignConnectionFinalizeExecution,

  FReassignConnectionPreparationExecution,
];
