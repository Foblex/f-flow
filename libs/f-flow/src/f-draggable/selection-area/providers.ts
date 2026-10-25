import { SelectionAreaPreparation } from './selection-area-preparation';
import { SelectionAreaFinalize } from './selection-area-finalize';
import { fExecution } from '../../_libs/f-mediator';
import { SelectionAreaFinalizeRequest } from './selection-area-finalize/selection-area-finalize-request';
import { SelectionAreaPreparationRequest } from './selection-area-preparation/selection-area-preparation-request';

export const DRAG_SELECTION_AREA_PROVIDERS = [
  fExecution(SelectionAreaPreparationRequest, SelectionAreaPreparation),
  fExecution(SelectionAreaFinalizeRequest, SelectionAreaFinalize),
];
