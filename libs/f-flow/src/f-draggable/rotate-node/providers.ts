import { RotateNodeFinalize } from './rotate-node-finalize';
import { RotateNodePreparation } from './rotate-node-preparation';
import { fExecution } from '../../_libs/f-mediator';
import { RotateNodeFinalizeRequest } from './rotate-node-finalize/rotate-node-finalize-request';
import { RotateNodePreparationRequest } from './rotate-node-preparation/rotate-node-preparation-request';

export const NODE_ROTATE_PROVIDERS = [
  fExecution(RotateNodeFinalizeRequest, RotateNodeFinalize),
  fExecution(RotateNodePreparationRequest, RotateNodePreparation),
];
