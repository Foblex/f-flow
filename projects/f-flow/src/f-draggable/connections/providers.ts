import {
  CreateConnectionDragHandlerExecution,
  CreateConnectionFinalizeExecution,
  CreateConnectionFinalizeValidator,
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
  ReassignConnectionFinalizeValidator,
  ReassignConnectionPreparationExecution, ReassignConnectionPreparationValidator,
} from './reassign-connection';
import { GetInputUnderPointerExecution, GetInputUnderPointerValidator } from './get-input-under-pointer';

export const CONNECTIONS_PROVIDERS = [

  GetInputUnderPointerExecution,

  GetInputUnderPointerValidator,

  CreateConnectionFinalizeExecution,

  CreateConnectionFinalizeValidator,

  CreateConnectionDragHandlerExecution,

  CreateConnectionFromOutletPreparationExecution,

  GetCanBeConnectedOutputByOutletExecution,

  GetCanBeConnectedOutputByOutletValidator,

  CreateConnectionFromOutputPreparationExecution,

  CreateConnectionFromOutputPreparationValidator,

  CreateConnectionPreparationExecution,

  CreateConnectionPreparationValidator,

  ReassignConnectionFinalizeExecution,

  ReassignConnectionFinalizeValidator,

  ReassignConnectionPreparationExecution,

  ReassignConnectionPreparationValidator,
];
