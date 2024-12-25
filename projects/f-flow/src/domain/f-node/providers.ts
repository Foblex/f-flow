import { AddNodeToStoreExecution } from './add-node-to-store';
import { RemoveNodeFromStoreExecution } from './remove-node-from-store';
import { UpdateNodeWhenStateOrSizeChangedExecution } from './update-node-when-state-or-size-changed';

export const F_NODE_FEATURES = [

  AddNodeToStoreExecution,

  UpdateNodeWhenStateOrSizeChangedExecution,

  RemoveNodeFromStoreExecution
];
