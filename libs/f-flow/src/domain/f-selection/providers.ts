import { ClearSelection } from './clear-selection';
import { GetCurrentSelection } from './get-current-selection';
import { Select } from './select-items';
import { SelectAll } from './select-all';
import { SelectAndUpdateNodeLayer } from './select-and-update-node-layer';
import { CalculateSelectableItems } from './calculate-selectable-items';
import { fExecution } from '../../_libs/f-mediator';
import { CalculateSelectableItemsRequest } from './calculate-selectable-items/calculate-selectable-items-request';
import { ClearSelectionRequest } from './clear-selection/clear-selection-request';
import { GetCurrentSelectionRequest } from './get-current-selection/get-current-selection-request';
import { SelectAllRequest } from './select-all/select-all-request';
import { SelectAndUpdateNodeLayerRequest } from './select-and-update-node-layer/select-and-update-node-layer-request';
import { SelectRequest } from './select-items/select-request';

/**
 * This module provides a collection of executions related to selection features in the FFlow domain.
 */
export const F_SELECTION_FEATURES = [
  fExecution(ClearSelectionRequest, ClearSelection),

  fExecution(CalculateSelectableItemsRequest, CalculateSelectableItems),

  fExecution(GetCurrentSelectionRequest, GetCurrentSelection),

  fExecution(SelectRequest, Select),

  fExecution(SelectAllRequest, SelectAll),

  fExecution(SelectAndUpdateNodeLayerRequest, SelectAndUpdateNodeLayer),
];
