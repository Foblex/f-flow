import {
  CreateConnectionDragHandlerExecution,
  CreateConnectionFinalizeExecution,
  CreateConnectionFromOutletPreparationExecution,
  CreateConnectionFromOutputPreparationExecution,
  CreateConnectionFromOutputPreparationValidator,
  CreateConnectionPreparationExecution,
  GetCanBeConnectedOutputByOutletExecution,
  GetCanBeConnectedOutputByOutletValidator
} from './create-connection';
import {
  ReassignConnectionFinalizeExecution,
  ReassignConnectionPreparationExecution,
} from './reassign-connection';

export const CONNECTIONS_PROVIDERS = [

  CreateConnectionFinalizeExecution,

  CreateConnectionDragHandlerExecution,

  CreateConnectionFromOutletPreparationExecution,

  GetCanBeConnectedOutputByOutletExecution,

  GetCanBeConnectedOutputByOutletValidator,

  CreateConnectionFromOutputPreparationExecution,

  CreateConnectionFromOutputPreparationValidator,

  CreateConnectionPreparationExecution,

  ReassignConnectionFinalizeExecution,

  ReassignConnectionPreparationExecution,
];
