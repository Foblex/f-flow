import { DropToGroupPreparation } from './drop-to-group-preparation';
import { DropToGroupFinalize } from './drop-to-group-finalize';
import { SortDropCandidatesByLayer } from './sort-drop-candidates-by-layer';
import { fExecution } from '../../_libs/f-mediator';
import { DropToGroupFinalizeRequest } from './drop-to-group-finalize/drop-to-group-finalize-request';
import { DropToGroupPreparationRequest } from './drop-to-group-preparation/drop-to-group-preparation-request';
import { SortDropCandidatesByLayerRequest } from './sort-drop-candidates-by-layer/sort-drop-candidates-by-layer-request';

export const DRAG_DROP_TO_GROUP_PROVIDERS = [
  fExecution(SortDropCandidatesByLayerRequest, SortDropCandidatesByLayer),

  fExecution(DropToGroupPreparationRequest, DropToGroupPreparation),

  fExecution(DropToGroupFinalizeRequest, DropToGroupFinalize),
];
