import { ClearSelectionExecution } from './clear-selection';
import { GetCurrentSelectionExecution } from './get-current-selection';
import { SelectExecution } from './select';
import { SelectAll } from './select-all';
import { SelectAndUpdateNodeLayer } from './select-and-update-node-layer';
import { CalculateSelectableItems } from './calculate-selectable-items';

/**
 * This module provides a collection of executions related to selection features in the FFlow domain.
 */
export const F_SELECTION_FEATURES = [
  ClearSelectionExecution,

  CalculateSelectableItems,

  GetCurrentSelectionExecution,

  SelectExecution,

  SelectAll,

  SelectAndUpdateNodeLayer,
];
