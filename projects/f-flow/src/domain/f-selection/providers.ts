import { ClearSelection } from './clear-selection';
import { GetCurrentSelection } from './get-current-selection';
import { Select } from './select-items';
import { SelectAll } from './select-all';
import { SelectAndUpdateNodeLayer } from './select-and-update-node-layer';
import { CalculateSelectableItems } from './calculate-selectable-items';

/**
 * This module provides a collection of executions related to selection features in the FFlow domain.
 */
export const F_SELECTION_FEATURES = [
  ClearSelection,

  CalculateSelectableItems,

  GetCurrentSelection,

  Select,

  SelectAll,

  SelectAndUpdateNodeLayer,
];
