import { FNodeDropToGroupPreparationExecution } from './drop-to-group-preparation';
import { FNodeDropToGroupFinalizeExecution } from './drop-to-group-finalize';
import {SortContainersForDropByLayerExecution} from './sort-containers-for-drop-by-layer';

export const NODE_DROP_TO_GROUP_PROVIDERS = [

  SortContainersForDropByLayerExecution,

  FNodeDropToGroupPreparationExecution,

  FNodeDropToGroupFinalizeExecution
];
