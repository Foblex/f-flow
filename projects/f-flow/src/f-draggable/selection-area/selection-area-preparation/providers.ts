import { SelectionAreaPreparationExecution } from './selection-area-preparation.execution';
import { SelectionAreaPreparationValidator } from './selection-area-preparation.validator';
import { SELECTION_AREA_FINALIZE_PROVIDERS } from '../selection-area-finalize';

export const SELECTION_AREA_PREPARATION_PROVIDERS = [

  SelectionAreaPreparationExecution,

  SelectionAreaPreparationValidator,
];
