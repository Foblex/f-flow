import { CreateConnectionPreparationExecution } from './create-connection-preparation.execution';
import { CreateConnectionPreparationValidator } from './create-connection-preparation.validator';
import { CREATE_CONNECTION_FROM_OUTLET_PREPARATION_PROVIDERS } from './create-connection-from-outlet-preparation';
import { CREATE_CONNECTION_FROM_OUTPUT_PREPARATION_PROVIDERS } from './create-connection-from-output-preparation';
import { CREATE_CONNECTION_DRAG_HANDLER_PROVIDERS } from './create-connection-drag-handler';

export const CREATE_CONNECTION_PREPARATION_PROVIDERS = [

  ...CREATE_CONNECTION_DRAG_HANDLER_PROVIDERS,

  ...CREATE_CONNECTION_FROM_OUTLET_PREPARATION_PROVIDERS,

  ...CREATE_CONNECTION_FROM_OUTPUT_PREPARATION_PROVIDERS,

  CreateConnectionPreparationExecution,

  CreateConnectionPreparationValidator,
];
