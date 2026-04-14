import { DropToGroupPreparation } from './drop-to-group-preparation';
import { DropToGroupFinalize } from './drop-to-group-finalize';
import { SortDropCandidatesByLayer } from './sort-drop-candidates-by-layer';

export const DRAG_DROP_TO_GROUP_PROVIDERS = [
  SortDropCandidatesByLayer,

  DropToGroupPreparation,

  DropToGroupFinalize,
];
