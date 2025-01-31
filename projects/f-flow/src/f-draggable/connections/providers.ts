import {
  CreateConnectionDragHandlerPreparationExecution,
  CreateConnectionFinalizeExecution,
  CreateConnectionFromOutletPreparationExecution,
  CreateConnectionFromOutputPreparationExecution,
  CreateConnectionPreparationExecution,
  GetCanBeConnectedOutputByOutletExecution,
} from './create-connection';
import {
  ReassignConnectionFinalizeExecution,
  ReassignConnectionPreparationExecution,
} from './reassign-connection';

export const CONNECTIONS_PROVIDERS = [

  CreateConnectionFinalizeExecution,

  CreateConnectionDragHandlerPreparationExecution,

  CreateConnectionFromOutletPreparationExecution,

  GetCanBeConnectedOutputByOutletExecution,

  CreateConnectionFromOutputPreparationExecution,

  CreateConnectionPreparationExecution,

  ReassignConnectionFinalizeExecution,

  ReassignConnectionPreparationExecution,
];
