import { DropToGroupPreparation } from './drop-to-group-preparation';
import { DropToGroupFinalize } from './drop-to-group-finalize';
import { SortContainersForDropByLayer } from './sort-containers-for-drop-by-layer';

export const NODE_DROP_TO_GROUP_PROVIDERS = [

  SortContainersForDropByLayer,

  DropToGroupPreparation,

  DropToGroupFinalize,
];
