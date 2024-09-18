import { ClearSelectionExecution } from './clear-selection';
import { GetSelectionExecution } from './get-selection';
import { SelectExecution } from './select';
import { SelectAllExecution } from './select-all';
import {
  SelectAndUpdateNodeLayerExecution
} from './select-and-update-node-layer/select-and-update-node-layer.execution';

export const F_SELECTION_FEATURES = [

  ClearSelectionExecution,

  GetSelectionExecution,

  SelectExecution,

  SelectAllExecution,

  SelectAndUpdateNodeLayerExecution
];
