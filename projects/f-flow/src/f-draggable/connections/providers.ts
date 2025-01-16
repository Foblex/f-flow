import {
  CreateConnectionDragHandlerExecution,
  CreateConnectionFinalizeExecution,
  CreateConnectionFromOutletPreparationExecution,
  CreateConnectionFromOutputPreparationExecution,
  CreateConnectionFromOutputPreparationValidator,
  CreateConnectionPreparationExecution,
  CreateConnectionPreparationValidator,
  GetCanBeConnectedOutputByOutletExecution,
  GetCanBeConnectedOutputByOutletValidator
} from './create-connection';
import {
  ReassignConnectionFinalizeExecution,
  ReassignConnectionPreparationExecution, ReassignConnectionPreparationValidator,
} from './reassign-connection';
import { GetInputUnderPointerExecution, GetInputUnderPointerValidator } from './get-input-under-pointer';

export const CONNECTIONS_PROVIDERS = [

  GetInputUnderPointerExecution,

  GetInputUnderPointerValidator,

  CreateConnectionFinalizeExecution,

  CreateConnectionDragHandlerExecution,

  CreateConnectionFromOutletPreparationExecution,

  GetCanBeConnectedOutputByOutletExecution,

  GetCanBeConnectedOutputByOutletValidator,

  CreateConnectionFromOutputPreparationExecution,

  CreateConnectionFromOutputPreparationValidator,

  CreateConnectionPreparationExecution,

  CreateConnectionPreparationValidator,

  ReassignConnectionFinalizeExecution,

  ReassignConnectionPreparationExecution,

  ReassignConnectionPreparationValidator,
];
